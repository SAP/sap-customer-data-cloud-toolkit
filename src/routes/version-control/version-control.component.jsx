/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Bar,
  Input,
  Button,
  Dialog,
  TextArea,
  Table,
  TableGrowingMode,
  TableColumn,
  TableRow,
  TableCell,
  Title,
  TitleLevel,
  FlexBox,
  Text,
  ValueState,
  Card,
  Grid,
  Label,
} from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { useSelector, useDispatch } from 'react-redux'
import {
  setGitToken,
  setOwner,
  setRepo,
  setCredentials,
  selectCommits,
  selectIsFetching,
  selectGitToken,
  selectOwner,
  selectRepo,
  getServices,
  fetchCommits,
  prepareFilesForUpdate,
  getRevertChanges,
  clearCommits,
  selectError,
} from '../../redux/versionControl/versionControlSlice'
import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import Cookies from 'js-cookie'
import { decryptData } from '../../redux/encryptionUtils'
import styles from './version-control.styles'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'
import { unwrapResult } from '@reduxjs/toolkit'

const useStyles = createUseStyles(styles, { name: 'VersionControl' })

const VersionControlComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)

  const commits = useSelector(selectCommits)
  const isFetching = useSelector(selectIsFetching)
  const gitToken = useSelector(selectGitToken)
  const owner = useSelector(selectOwner)
  const errors = useSelector(selectError)
  const repo = useSelector(selectRepo)

  const [commitMessage, setCommitMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filesToUpdate, setFilesToUpdate] = useState([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (credentials) {
      dispatch(setCredentials(credentials))
    }
  }, [dispatch, credentials])

  useEffect(() => {
    if (gitToken && owner && repo) {
      dispatch(fetchCommits())
    }
  }, [dispatch, gitToken, owner, repo])

  useEffect(() => {
    const secretKey = credentials?.secretKey
    if (secretKey) {
      const encryptedGitToken = Cookies.get('gitToken')
      const encryptedOwner = Cookies.get('owner')
      const repo = Cookies.get('repo')

      if (encryptedGitToken) {
        const decryptedGitToken = decryptData(encryptedGitToken, secretKey)
        dispatch(setGitToken(decryptedGitToken))
      }
      if (encryptedOwner) {
        const decryptedOwner = decryptData(encryptedOwner, secretKey)
        dispatch(setOwner(decryptedOwner))
      }
      if (repo) {
        dispatch(setRepo(repo))
      }
    }
  }, [credentials, dispatch])

  const onCreateBackupClick = async () => {
    try {
      const resultAction = await dispatch(prepareFilesForUpdate())
      console.log('result', resultAction)
      const formattedFiles = unwrapResult(resultAction)
      setFilesToUpdate(formattedFiles)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error preparing backup:', error)
    }
  }

  const onConfirmBackupClick = async () => {
    try {
      dispatch(getServices(commitMessage))
      dispatch(fetchCommits())
      setSuccessMessage(t('VERSION_CONTROL.BACKUP.SUCCESS.MESSAGE'))
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error creating backup:', error)
    } finally {
      setIsDialogOpen(false)
    }
  }

  const onCancelBackupClick = () => {
    setIsDialogOpen(false)
  }

  const onCommitRevertClick = async (sha) => {
    try {
      dispatch(getRevertChanges(sha))
      dispatch(fetchCommits())
      setSuccessMessage('success')
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error reverting commit:', error)
    }
  }

  const handleGitTokenChange = (e) => {
    dispatch(setGitToken(e.target.value))
    dispatch(clearCommits()) // Clear commits when repo changes
  }

  const handleOwnerChange = (e) => {
    dispatch(setOwner(e.target.value))
    dispatch(clearCommits()) // Clear commits when repo changes
  }

  const handleRepoChange = (e) => {
    dispatch(setRepo(e.target.value))
    dispatch(clearCommits()) // Clear commits when repo changes
  }

  const handleCommitMessageChange = (e) => {
    setCommitMessage(e.target.value)
  }

  const onLoadMore = () => {
    if (!isFetching) {
      dispatch(fetchCommits())
    }
  }

  const onSuccessDialogAfterClose = () => {
    setShowSuccessDialog(false)
  }

  const renderStatusMessage = () => {
    if (!gitToken || !owner || !repo || errors) {
      return <div></div>
    } else if (commits.length === 0) {
      return <Bar className={classes.noCommitsBar} id="versionControlCommitBar" startContent={<Text>{t('VERSION_CONTROL.NO_COMMITS')}</Text>} />
    }
    return null
  }

  const showSuccessMessage = () => (
    <DialogMessageInform
      open={showSuccessDialog}
      headerText={t('GLOBAL.SUCCESS')}
      state={ValueState.Success}
      closeButtonContent={t('GLOBAL.OK')}
      onAfterClose={onSuccessDialogAfterClose}
      id="versionControlSuccessPopup"
      data-cy="versionControlSuccessPopup"
    >
      <Text>{successMessage}</Text>
    </DialogMessageInform>
  )

  return (
    <>
      <div className={classes.fullContainer}>
        <Bar
          design="Header"
          startContent={
            <>
              <Title id="versionControlTitle" data-cy="versionControlTitle" level={TitleLevel.H3} className={classes.titleStyle}>
                <span className={classes.pageTitleSpanStyle}>{t('VERSION_CONTROL.TITLE')}</span>
              </Title>
            </>
          }
        />
        <div className={classes.outerDivStyle}>
          <div className={classes.headerOuterDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text id="versionControl" data-cy="versionControl" className={classes.componentTextStyle}>
                {t('VERSION_CONTROL.DESCRIPTION.TEXT')}
              </Text>
            </FlexBox>

            <Card className={classes.credentialsCard}>
              <Title className={classes.credentialsCardTitle} level="H4">
                {t('VERSION_CONTROL.CREDENTIALS')}
              </Title>
              <Text id="versionControlTitle" data-cy="versionControlTitle" level={'H5'} className={classes.titleStyle}>
                <span className={classes.credentialsDescriptionStyle}>{t('VERSION_CONTROL.CREDENTIALS_DESCRIPTION')}</span>
              </Text>
              <Grid className={classes.credentialsGridStyle}>
                <>
                  <div style={{ display: 'inline-flex' }} className={classes.currentInfoContainer} data-layout-span="XL5 L5 M5 S5">
                    <div className={classes.inputField}>
                      <Title level="H5" className={classes.currentInfoContainerTitle}>
                        {t('VERSION_CONTROL.OWNER')}*
                      </Title>
                      <Input
                        id="ownerInput"
                        data-cy="ownerInput"
                        value={owner}
                        onChange={handleOwnerChange}
                        placeholder="Owner"
                        valueState="Information"
                        valueStateMessage={<div>{t('VERSION_CONTROL.OWNER_MESSAGE')}</div>}
                        required
                      />
                    </div>
                    <div className={classes.inputField}>
                      <Title level="H5" className={classes.currentInfoContainerTitle}>
                        {t('VERSION_CONTROL.GIT_TOKEN')}*
                      </Title>
                      <Input
                        id="gitTokenInput"
                        data-cy="gitTokenInput"
                        value={gitToken}
                        onChange={handleGitTokenChange}
                        placeholder="Git Token"
                        type="Password"
                        valueState="Information"
                        valueStateMessage={<div>{t('VERSION_CONTROL.GIT_TOKEN_MESSAGE')}</div>}
                        required
                      />
                    </div>
                    <div className={classes.inputField}>
                      <Title level="H5" className={classes.currentInfoContainerTitle}>
                        {t('VERSION_CONTROL.REPOSITORY')}*
                      </Title>
                      <Input
                        id="repoInput"
                        data-cy="repoInput"
                        value={repo}
                        onChange={handleRepoChange}
                        placeholder="Repository"
                        valueState="Information"
                        valueStateMessage={<div>{t('VERSION_CONTROL.REPOSITORY_MESSAGE')}</div>}
                        required
                      />
                    </div>
                    {(!gitToken || !owner || errors) && (
                      <div id="warningCredentials" className={classes.warningMessage}>
                        {t('VERSION_CONTROL.INSERT_CONFIGURATIONS')}
                      </div>
                    )}
                  </div>
                </>
              </Grid>
            </Card>

            <Card className={classes.versionListTable} id="versionListTable">
              <>
                <div id="versionList" className={classes.cardTitle}>
                  <Title level="H4" className={classes.versionListText}>
                    {t('VERSION_CONTROL.VERSION_LIST')}
                  </Title>
                  <Button
                    id="backupButton"
                    data-cy="backupButton"
                    design="Emphasized"
                    className={`${classes.singlePrettifyButton} ${classes.backupButton} ${classes.flexButton}`}
                    onClick={onCreateBackupClick}
                    disabled={!gitToken || !owner || !repo || errors !== null}
                  >
                    {t('VERSION_CONTROL.BACKUP')}
                  </Button>
                </div>
              </>

              <div>
                {renderStatusMessage() ?? (
                  <div className={classes.tableContainer}>
                    <Table
                      stickyColumnHeader={true}
                      growing={TableGrowingMode.Scroll}
                      onLoadMore={onLoadMore}
                      columns={
                        <>
                          <TableColumn style={{ minWidth: '70px', width: '70px' }}>{t('VERSION_CONTROL.DATE')}</TableColumn>
                          <TableColumn style={{ minWidth: '85px', width: '85px' }}>{t('VERSION_CONTROL.ID')}</TableColumn>
                          <TableColumn>{t('VERSION_CONTROL.COMMIT_MESSAGE')}</TableColumn>
                          <TableColumn className={classes.restoreRowTitle} style={{ width: '45px' }}>
                            {t('VERSION_CONTROL.ACTION')}
                          </TableColumn>
                        </>
                      }
                    >
                      {commits.map((commit, index) => (
                        <TableRow key={index}>
                          <TableCell className={classes.dateCollumnStyle}>{new Date(commit.commit.committer.date).toLocaleString()}</TableCell>
                          <TableCell className={classes.idCollumnStyle}>
                            <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
                              {commit.sha.substring(0, 7)}
                            </a>
                          </TableCell>
                          <TableCell className={classes.messageCollumnStyle}>{commit.commit.message}</TableCell>
                          <TableCell className={classes.restoreButton}>
                            <Button
                              design="Default"
                              id={`commitRevertButton-${index}`}
                              data-cy="revertCommitButton"
                              className={classes.singlePrettifyRestoreButton}
                              onClick={() => onCommitRevertClick(commit.sha)}
                            >
                              {t('VERSION_CONTROL.RESTORE')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Table>
                  </div>
                )}
              </div>
            </Card>
            <Dialog
              open={isDialogOpen}
              className="ui-dialog"
              onAfterClose={onCancelBackupClick}
              id="backupDialog"
              data-cy="backupDialog"
              header={
                <div id="header" className={classes.headerOuterDivStyle3}>
                  <div className={classes.headerInnerDivStyle}>{t('VERSION_CONTROL.BACKUP.INFORMATION')}</div>
                </div>
              }
              children={
                <div className={classes.specifyFileLableStyle}>
                  <div className={classes.specifyFileLableStyle}>
                    <Label id="specifyFileLabel">{t('VERSION_CONTROL.UPLOAD_MESSAGE')}</Label>
                  </div>
                  <ul>
                    {filesToUpdate.map((file, index) => (
                      <li className={classes.filesToUpdate} key={index}>
                        <Text>{file}</Text>
                      </li>
                    ))}
                  </ul>
                  <TextArea
                    data-cy="commitMessageInput"
                    value={commitMessage}
                    onInput={handleCommitMessageChange}
                    placeholder={t('VERSION_CONTROL.COMMIT_MESSAGE_PLACEHOLDER')}
                    rows={4}
                    disabled={filesToUpdate.includes('N/A')}
                  />
                </div>
              }
              footer={
                <div className={classes.footerOuterDivStyle}>
                  <Button data-cy="confirmBackupButton" className="btn dialog-button-1" onClick={onConfirmBackupClick} disabled={filesToUpdate.includes('N/A')}>
                    {t('VERSION_CONTROL.CONFIRM')}
                  </Button>
                  <Button data-cy="cancelBackupButton" className="btn dialog-button-2" onClick={onCancelBackupClick}>
                    {t('VERSION_CONTROL.CANCEL')}
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
      {showSuccessMessage()}
    </>
  )
}

export default withTranslation()(VersionControlComponent)
