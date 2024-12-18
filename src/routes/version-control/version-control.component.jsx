import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { Bar, Input, Button, Dialog, TextArea } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { createVersionControlInstance, handleGetServices, handleCommitListRequestServices, handleCommitRevertServices } from '../../services/versionControl/versionControlService'
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
  const [commitMessage, setCommitMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)

  useEffect(() => {
    if (gitToken) {
      const versionControl = createVersionControlInstance(credentials, apiKey, currentSite)
      ;(async () => {
        const commitList = await versionControl.getCommits(page, perPage)
        setCommits(commitList)
      })()
    }
  }, [gitToken, credentials, apiKey, currentSite, page, perPage])

  const onCreateBackupClick = () => {
    setIsDialogOpen(true)
  }

  const onConfirmBackupClick = async () => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite)
    const commitList = await handleGetServices(versionControl, apiKey, commitMessage)
    if (commitList) setCommits(commitList)
    setIsDialogOpen(false)
  }

  const onCancelBackupClick = () => {
    setIsDialogOpen(false)
  }

  const onCommitRevertClick = async (sha) => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite)
    await handleCommitRevertServices(versionControl, sha)
  }

  const handleGitTokenChange = (e) => {
    const token = e.target.value
    setGitToken(token)
    Cookies.set('gitToken', token, { secure: true, sameSite: 'strict' })
  }

  const handleCommitMessageChange = (e) => {
    setCommitMessage(e.target.value)
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  return (
    <>
      <Bar
        className={classes.innerBarStyle}
        endContent={
          <>
            <Input
              value={gitToken}
              onChange={handleGitTokenChange}
              placeholder="Git Token"
              type="Password"
              valueState="Information"
              valueStateMessage={<div>Insert your Git Token to use this tool</div>}
            />
            <Button id="backupButton" data-cy="backupButton" className={classes.singlePrettifyButton} onClick={onCreateBackupClick} disabled={!gitToken}>
              {t('VERSION_CONTROL.BACKUP')}
            </Button>
          </>
        }
      ></Bar>

      <Dialog
        open={isDialogOpen}
        headerText="Commit Message"
        footer={
          <>
            <Button onClick={onConfirmBackupClick}>{t('VERSION_CONTROL.CONFIRM')}</Button>
            <Button onClick={onCancelBackupClick}>{t('VERSION_CONTROL.CANCEL')}</Button>
          </>
        }
      >
        <TextArea value={commitMessage} onInput={handleCommitMessageChange} placeholder="Write your commit message here" rows={4} />
      </Dialog>

      <div className={classes.commitsContainer}>
        <table className={classes.commitTable}>
          <thead>
            <tr>
              <th>{t('VERSION_CONTROL.ID')}</th>
              <th>{t('VERSION_CONTROL.DATE')}</th>
              <th>{t('VERSION_CONTROL.COMMIT_MESSAGE')}</th>
              <th>Toggle</th>
            </tr>
          </thead>
          <tbody>
            {commits.length === 0 ? (
              <tr>
                <td colSpan="4">No commits available</td>
              </tr>
            ) : (
              commits.map((commit, index) => (
                <tr key={index}>
                  <td>{commit.sha.substring(0, 7)}</td>
                  <td>{new Date(commit.commit.committer.date).toLocaleString()}</td>
                  <td>{commit.commit.message}</td>
                  <td>
                    <Button id={`commitRevertButton-${index}`} className={classes.singlePrettifyButton} onClick={() => onCommitRevertClick(commit.sha)}>
                      {t('VERSION_CONTROL.RESTORE')}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={classes.paginationButtons}>
          <Button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={commits.length < perPage}>
            Next
          </Button>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(VersionControlComponent)
