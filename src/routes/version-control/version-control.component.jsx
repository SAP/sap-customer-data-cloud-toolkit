import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector, useDispatch } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Cookies from 'js-cookie'
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
  BusyIndicator,
} from '@ui5/webcomponents-react'
import {
  setGitToken,
  setOwner,
  setRepo,
  setOpenConfirmDialog,
  setShowSuccessDialog,
  setShowErrorDialog,
  setCredentials,
  getServices,
  fetchCommits,
  validateCredentials,
  prepareFilesForUpdate,
  getRevertChanges,
  selectCommits,
  selectIsFetching,
  selectGitToken,
  selectOwner,
  selectRepo,
  selectError,
  selectFilesToUpdate,
  selectValidationError,
  selectOpenConfirmDialog,
  selectShowSuccessDialog,
  selectShowErrorDialog,
  selectSuccessMessage
} from '../../redux/versionControl/versionControlSlice'
import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { getCurrentSiteInformation, selectCurrentSiteApiKey, updateCurrentSiteApiKey } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'
import styles from './version-control.styles'
import { decryptData } from '../../redux/encryptionUtils'
import { getApiKey } from '../../redux/utils'
import { ROUTE_VERSION_CONTROL } from '../../inject/constants'

const PAGE_TITLE = 'VersionControl'
const useStyles = createUseStyles(styles, { name: PAGE_TITLE })

const VersionControlComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)

  const commits = useSelector(selectCommits)
  const isFetching = useSelector(selectIsFetching)
  const gitToken = useSelector(selectGitToken)
  const owner = useSelector(selectOwner)
  const error = useSelector(selectError)
  const repo = useSelector(selectRepo)
  const apiKey = useSelector(selectCurrentSiteApiKey)
  const filesToUpdate = useSelector(selectFilesToUpdate)
  const validationError = useSelector(selectValidationError)
  const openConfirmDialog = useSelector(selectOpenConfirmDialog)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const showErrorDialog = useSelector(selectShowErrorDialog)
  const successMessage = useSelector(selectSuccessMessage)

  const [commitMessage, setCommitMessage] = useState('')

  window.navigation.onnavigate = (event) => {
    if (event.navigationType === 'replace' && window.location.hash.includes(ROUTE_VERSION_CONTROL)) {
      if (apiKey !== getApiKey(window.location.hash)) {
        dispatch(updateCurrentSiteApiKey())
      }
      dispatch(getCurrentSiteInformation())
    }
  }

  useEffect(() => {
    if (credentials) {
      dispatch(setCredentials(credentials))
    }

    dispatch(validateCredentials())

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
    if (gitToken && owner && repo) {
      dispatch(fetchCommits())
    }
  }, [credentials, gitToken, owner, repo, dispatch])

  const onCreateBackupClick = () => {
    dispatch(prepareFilesForUpdate())
  }

  const onConfirmBackupClick = async () => {
    dispatch(getServices(commitMessage))
    dispatch(setOpenConfirmDialog(false))
  }

  const onCancelBackupClick = () => {
    dispatch(setOpenConfirmDialog(false))
  }

  const onCommitRevertClick = (sha) => {
    dispatch(getRevertChanges(sha))
  }

  const handleGitTokenChange = (e) => {
    dispatch(setGitToken(e.target.value))
  }

  const handleOwnerChange = (e) => {
    dispatch(setOwner(e.target.value))
  }

  const handleRepoChange = (e) => {
    dispatch(setRepo(e.target.value))
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
    dispatch(setShowSuccessDialog(false))
  }

  const onErrorDialogAfterClose = () => {
    dispatch(setShowErrorDialog(false))
  }

  const renderStatusMessage = () => {
    if (!gitToken || !owner || !repo || error) {
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

  const showErrorMessage = () => (
    <DialogMessageInform
      open={showErrorDialog}
      headerText={t('GLOBAL.ERROR')}
      state={ValueState.Error}
      closeButtonContent={t('GLOBAL.OK')}
      onAfterClose={onErrorDialogAfterClose}
      id="versionControlErrorPopup"
      data-cy="versionControlErrorPopup"
    >
      <Text>{error}</Text>
    </DialogMessageInform>
  )

  return (
    <>
      <BusyIndicator active={isFetching} delay={0}>
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
                      {(!gitToken || !owner || validationError) && (
                        <div id="warningCredentials" className={classes.warningMessage}>
                          {validationError && <div className={classes.errorMessage}>{validationError.toString()}</div>}
                          {t('VERSION_CONTROL.INSERT_CONFIGURATIONS')}
                          <a href="https://github.com/SAP/sap-customer-data-cloud-toolkit/wiki/Documentation#prettier" target="_blank" rel="noopener noreferrer">
                            {t('VERSION_CONTROL.DOCUMENTATION_LINK')}
                          </a>
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
                      disabled={isFetching || !gitToken || !owner || !repo || error !== null}
                    >
                      {t('VERSION_CONTROL.BACKUP')}
                    </Button>
                  </div>
                </>

                <div>
                  {renderStatusMessage() ?? (
                    <div className={classes.tableContainer}>
                      <Table
                        id="versionControlTable"
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
                                disabled={isFetching}
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
                open={openConfirmDialog}
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
                  filesToUpdate.length > 0 ? (
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
                      />
                    </div>
                  ) : (
                    <div className={classes.specifyFileLableStyle}>
                      <Text>{t('VERSION_CONTROL.NO_CHANGES')}</Text>
                    </div>
                  )
                }
                footer={
                  <div className={classes.footerOuterDivStyle}>
                    {filesToUpdate.length > 0 ? (
                      <>
                        <Button data-cy="confirmBackupButton" className="btn dialog-button-1" onClick={onConfirmBackupClick}>
                          {t('VERSION_CONTROL.CONFIRM')}
                        </Button>
                        <Button data-cy="cancelBackupButton" className="btn dialog-button-2" onClick={onCancelBackupClick}>
                          {t('VERSION_CONTROL.CANCEL')}
                        </Button>
                      </>
                    ) : (
                      <Button data-cy="okButton" design="Emphasized" className={`${classes.okButtonStyle} "fd-button"`} onClick={onCancelBackupClick}>
                        {t('GLOBAL.OK')}
                      </Button>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </BusyIndicator>

      {showSuccessMessage()}
      {showErrorMessage()}
    </>
  )
}

export default withTranslation()(VersionControlComponent)
