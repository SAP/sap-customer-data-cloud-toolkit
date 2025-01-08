import React, { useState, useEffect, useCallback } from 'react'
import { withTranslation } from 'react-i18next'
import { Bar, Input, Button, Dialog, TextArea, List, StandardListItem, MessageBox, Table, TableGrowingMode, TableColumn, TableRow, TableCell } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { createVersionControlInstance, handleGetServices, handleCommitListRequestServices, handleCommitRevertServices } from '../../services/versionControl/versionControlService'
import * as githubUtils from '../../services/versionControl/githubUtils'
import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { getApiKey } from '../../redux/utils'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'
import styles from './version-control.styles'

const useStyles = createUseStyles(styles, { name: 'Prettier' })

const VersionControlComponent = ({ t }) => {
  const classes = useStyles()
  const currentSite = useSelector(selectCurrentSiteInformation)
  const credentials = useSelector(selectCredentials)
  const apiKey = getApiKey(window.location.hash)

  const [commits, setCommits] = useState([])
  const [gitToken, setGitToken] = useState(Cookies.get('gitToken') || '')
  const [owner, setOwner] = useState(Cookies.get('owner') || '')
  const [commitMessage, setCommitMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [resultMessages, setResultMessages] = useState([])
  const [filesToUpdate, setFilesToUpdate] = useState([])
  const [loadedCommits, setLoadedCommits] = useState(new Set())

  const fetchCommits = useCallback(async () => {
    if (gitToken && owner) {
      const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, owner)
      try {
        const { commitList } = await handleCommitListRequestServices(versionControl, apiKey, commits.length / 10 + 1, 10)
        const uniqueCommits = commitList.filter((commit) => !loadedCommits.has(commit.sha))
        setCommits((prevCommits) => [...prevCommits, ...uniqueCommits])
        setLoadedCommits((prevLoadedCommits) => new Set([...prevLoadedCommits, ...uniqueCommits.map((commit) => commit.sha)]))
      } catch (error) {
        console.error('Error fetching commits:', error)
      }
    }
  }, [gitToken, owner, credentials, apiKey, currentSite, commits.length, loadedCommits])

  useEffect(() => {
    fetchCommits() // Fetch commits on initial render and when dependencies change
  }, [fetchCommits])

  const onCreateBackupClick = async () => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, owner)
    try {
      const formattedFiles = await githubUtils.prepareFilesForUpdate(versionControl)
      setFilesToUpdate(formattedFiles)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error preparing backup:', error)
    }
  }

  const onConfirmBackupClick = async () => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, owner)
    try {
      const result = await handleGetServices(versionControl, apiKey, commitMessage)
      setResultMessages(result || [])
      setIsResultDialogOpen(true)
      setCommits([]) // Clear commits before fetching new ones
      setLoadedCommits(new Set()) // Clear loaded commits
      await fetchCommits() // Refresh the commits list after confirmation
      MessageBox.success(t('VERSION_CONTROL.SUCCESS_MESSAGE'))
    } catch (error) {
      console.error('Error creating backup:', error)
    } finally {
      setIsDialogOpen(false) // Close the dialog
    }
  }

  const onCancelBackupClick = () => {
    setIsDialogOpen(false)
  }

  const onCommitRevertClick = async (sha) => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, owner)
    try {
      await handleCommitRevertServices(versionControl, sha)
      setCommits([]) // Clear commits before fetching new ones
      setLoadedCommits(new Set()) // Clear loaded commits
      await fetchCommits() // Refresh the commits list after revert
    } catch (error) {
      console.error('Error reverting commit:', error)
    }
  }

  const handleGitTokenChange = (e) => {
    const token = e.target.value
    setGitToken(token)
    Cookies.set('gitToken', token, { secure: true, sameSite: 'strict' })
  }

  const handleOwnerChange = (e) => {
    const owner = e.target.value
    setOwner(owner)
    Cookies.set('owner', owner, { secure: true, sameSite: 'strict' })
  }

  const handleCommitMessageChange = (e) => {
    setCommitMessage(e.target.value)
  }

  const onLoadMore = () => {
    fetchCommits()
  }

  const handleResultDialogClose = () => {
    setIsResultDialogOpen(false)
  }

  return (
    <>
      <Bar
        startContent={
          <>
            <h2>{t('VERSION_CONTROL.TITLE')}</h2>
          </>
        }
      ></Bar>

      <Bar
        className={classes.innerBarStyle}
        startContent={
          <>
            <div>
              <h3>{t('VERSION_CONTROL.CREDENTIALS')}</h3>
              <div className={classes.inputContainer}>
                <div className={classes.inputRow}>
                  <div className={classes.inputField}>
                    <label className={classes.inputLabel}>{t('VERSION_CONTROL.OWNER')}</label>
                    <Input
                      value={owner}
                      onChange={handleOwnerChange}
                      placeholder="Owner"
                      valueState="Information"
                      valueStateMessage={<div>{t('VERSION_CONTROL.OWNER_MESSAGE')}</div>}
                    />
                  </div>
                  <div className={classes.inputField}>
                    <label className={classes.inputLabel}>{t('VERSION_CONTROL.GIT_TOKEN')}</label>
                    <Input
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
            <Button id="backupButton" data-cy="backupButton" className={classes.singlePrettifyButton} onClick={onCreateBackupClick} disabled={!gitToken || !owner}>
              {t('VERSION_CONTROL.BACKUP')}
            </Button>
          </>
        }
      ></Bar>

      <Dialog
        open={isDialogOpen}
        headerText={t('VERSION_CONTROL.COMMIT_MESSAGE')}
        footer={
          <>
            <Button onClick={onConfirmBackupClick} disabled={filesToUpdate.includes('N/A')}>
              {t('VERSION_CONTROL.CONFIRM')}
            </Button>
            <Button onClick={onCancelBackupClick}>{t('VERSION_CONTROL.CANCEL')}</Button>
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
          value={commitMessage}
          onInput={handleCommitMessageChange}
          placeholder={t('VERSION_CONTROL.COMMIT_MESSAGE_PLACEHOLDER')}
          rows={4}
          disabled={filesToUpdate.includes('N/A')}
        />
      </Dialog>

      <Dialog
        open={isResultDialogOpen}
        headerText={t('VERSION_CONTROL.RESULT')}
        footer={
          <>
            <Button onClick={handleResultDialogClose}>{t('VERSION_CONTROL.CLOSE')}</Button>
          </>
        }
      >
        <List>
          {resultMessages.map((message, index) => (
            <StandardListItem key={index}>{message.includes('Skipped backup') ? <b>{message}</b> : message}</StandardListItem>
          ))}
        </List>
      </Dialog>

      <div className={classes.fullHeightContainer}>
        <div className={classes.tableContainer}>
          <Table
            growing={TableGrowingMode.Scroll}
            onLoadMore={onLoadMore}
            columns={
              <>
                <TableColumn style={{ width: '150px' }}>{t('VERSION_CONTROL.ID')}</TableColumn>
                <TableColumn style={{ width: '200px' }}>{t('VERSION_CONTROL.DATE')}</TableColumn>
                <TableColumn style={{ width: '400px' }}>{t('VERSION_CONTROL.COMMIT_MESSAGE')}</TableColumn>
                <TableColumn style={{ width: '150px' }}>{t('VERSION_CONTROL.ACTION')}</TableColumn>
              </>
            }
          >
            {commits.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4">{t('VERSION_CONTROL.NO_COMMITS')}</TableCell>
              </TableRow>
            ) : (
              commits.map((commit, index) => (
                <TableRow key={index}>
                  <TableCell>{commit.sha.substring(0, 7)}</TableCell>
                  <TableCell>{new Date(commit.commit.committer.date).toLocaleString()}</TableCell>
                  <TableCell>{commit.commit.message}</TableCell>
                  <TableCell>
                    <Button id={`commitRevertButton-${index}`} className={classes.singlePrettifyButton} onClick={() => onCommitRevertClick(commit.sha)}>
                      {t('VERSION_CONTROL.RESTORE')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </Table>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(VersionControlComponent)
