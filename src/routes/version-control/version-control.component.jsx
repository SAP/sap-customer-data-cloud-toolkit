/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { Bar, Input, Button, Dialog, TextArea, Table, TableGrowingMode, TableColumn, TableRow, TableCell, Title, TitleLevel, FlexBox, Text } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCommits, setGitToken, setOwner, setCredentials, selectCommits, selectIsFetching, selectGitToken, selectOwner } from '../../redux/versionControl/versionControlSlice'
import { createVersionControlInstance, handleGetServices, handleCommitRevertServices } from '../../services/versionControl/versionControlService'
import * as githubUtils from '../../services/versionControl/githubUtils'
import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { getApiKey } from '../../redux/utils'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'
import Cookies from 'js-cookie'
import { decryptData } from '../../redux/encryptionUtils'
import styles from './version-control.styles'

const useStyles = createUseStyles(styles, { name: 'VersionControl' })

const VersionControlComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const currentSite = useSelector(selectCurrentSiteInformation)
  const credentials = useSelector(selectCredentials)
  const apiKey = getApiKey(window.location.hash)

  const commits = useSelector(selectCommits)
  const isFetching = useSelector(selectIsFetching)
  const gitToken = useSelector(selectGitToken)
  const owner = useSelector(selectOwner)

  const [commitMessage, setCommitMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filesToUpdate, setFilesToUpdate] = useState([])

  useEffect(() => {
    if (credentials) {
      dispatch(setCredentials(credentials))
    }
  }, [dispatch, credentials])

  useEffect(() => {
    if (gitToken && owner) {
      dispatch(fetchCommits())
    }
  }, [dispatch, gitToken, owner])

  useEffect(() => {
    const secretKey = credentials?.secretKey
    if (secretKey) {
      const encryptedGitToken = Cookies.get('gitToken')
      const encryptedOwner = Cookies.get('owner')
      if (encryptedGitToken) {
        const decryptedGitToken = decryptData(encryptedGitToken, secretKey)
        dispatch(setGitToken(decryptedGitToken))
      }
      if (encryptedOwner) {
        const decryptedOwner = decryptData(encryptedOwner, secretKey)
        dispatch(setOwner(decryptedOwner))
      }
    }
  }, [credentials, dispatch])

  const onCreateBackupClick = async () => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, gitToken, owner)
    try {
      const formattedFiles = await githubUtils.prepareFilesForUpdate(versionControl)
      setFilesToUpdate(formattedFiles)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error preparing backup:', error)
    }
  }

  const onConfirmBackupClick = async () => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, gitToken, owner)
    try {
      await handleGetServices(versionControl, apiKey, commitMessage)
      dispatch(fetchCommits())
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
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, gitToken, owner)
    try {
      await handleCommitRevertServices(versionControl, sha)
      dispatch(fetchCommits())
    } catch (error) {
      console.error('Error reverting commit:', error)
    }
  }

  const handleGitTokenChange = (e) => {
    dispatch(setGitToken(e.target.value))
  }

  const handleOwnerChange = (e) => {
    dispatch(setOwner(e.target.value))
  }

  const handleCommitMessageChange = (e) => {
    setCommitMessage(e.target.value)
  }

  const onLoadMore = () => {
    if (!isFetching) {
      dispatch(fetchCommits())
    }
  }

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
              <Text id="importAccountsHeaderText" data-cy="importAccountsHeaderText" className={classes.componentTextStyle}>
                {t('VERSION_CONTROL.DESCRIPTION.TEXT')}
              </Text>
            </FlexBox>

            <Bar
              className={classes.credentialsBlock}
              startContent={
                <>
                  <div>
                    <h3>{t('VERSION_CONTROL.CREDENTIALS')}</h3>
                  </div>
                </>
              }
            />

            <Bar
              className={classes.innerBarStyle}
              startContent={
                <>
                  <div className={classes.credentialsBlock}>
                    <div className={classes.inputContainer}>
                      <div className={classes.inputRow}>
                        <div className={classes.inputField}>
                          <label className={classes.inputLabel}>{t('VERSION_CONTROL.OWNER')}*</label>
                          <Input
                            id="ownerInput"
                            data-cy="ownerInput"
                            value={owner}
                            onChange={handleOwnerChange}
                            placeholder="Owner"
                            valueState="Information"
                            valueStateMessage={<div>{t('VERSION_CONTROL.OWNER_MESSAGE')}</div>}
                          />
                        </div>
                        <div className={classes.inputField}>
                          <label className={classes.inputLabel}>{t('VERSION_CONTROL.GIT_TOKEN')}*</label>
                          <Input
                            id="gitTokenInput"
                            data-cy="gitTokenInput"
                            value={gitToken}
                            onChange={handleGitTokenChange}
                            placeholder="Git Token"
                            type="Password"
                            valueState="Information"
                            valueStateMessage={<div>{t('VERSION_CONTROL.GIT_TOKEN_MESSAGE')}</div>}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
            />

            <Bar
              className={classes.backupButtonBar}
              startContent={
                <>
                  <h3 className="h3Title" id="versionList">
                    {' '}
                    Version List{' '}
                  </h3>
                </>
              }
              endContent={
                <>
                  <Button
                    id="backupButton"
                    data-cy="backupButton"
                    className={`${classes.singlePrettifyButton} ${classes.backupButton}`}
                    onClick={onCreateBackupClick}
                    disabled={!gitToken || !owner}
                  >
                    {t('VERSION_CONTROL.BACKUP')}
                  </Button>
                </>
              }
            />

            <Dialog
              data-cy="backupDialog"
              open={isDialogOpen}
              headerText={t('VERSION_CONTROL.COMMIT_MESSAGE')}
              footer={
                <>
                  <Button data-cy="confirmBackupButton" onClick={onConfirmBackupClick} disabled={filesToUpdate.includes('N/A')}>
                    {t('VERSION_CONTROL.CONFIRM')}
                  </Button>
                  <Button data-cy="cancelBackupButton" onClick={onCancelBackupClick}>
                    {t('VERSION_CONTROL.CANCEL')}
                  </Button>
                </>
              }
            >
              <p>{t('VERSION_CONTROL.UPLOAD_MESSAGE')}</p>
              <ul>
                {filesToUpdate.map((file, index) => (
                  <li key={index}>{file}</li>
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
            </Dialog>

            <div>
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
                  {commits.length === 0 ? (
                    <TableRow>
                      <TableCell>{t('VERSION_CONTROL.NO_COMMITS')}</TableCell>
                    </TableRow>
                  ) : (
                    commits.map((commit, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.dateCollumnStyle}>{new Date(commit.commit.committer.date).toLocaleString()}</TableCell>
                        <TableCell className={classes.idCollumnStyle}>{commit.sha.substring(0, 7)}</TableCell>
                        <TableCell className={classes.messageCollumnStyle}>{commit.commit.message}</TableCell>
                        <TableCell className={classes.restoreButton}>
                          <Button
                            id={`commitRevertButton-${index}`}
                            data-cy="revertCommitButton"
                            className={classes.singlePrettifyRestoreButton}
                            onClick={() => onCommitRevertClick(commit.sha)}
                          >
                            {t('VERSION_CONTROL.RESTORE')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(VersionControlComponent)
