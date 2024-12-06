import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { Bar, Input, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
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

  const versionControl = createVersionControlInstance(credentials, apiKey, currentSite)
  const [commits, setCommits] = useState([])
  const [gitToken, setGitToken] = useState('')

  useEffect(() => {
    ;(async () => {
      const commitList = await handleCommitListRequestServices(versionControl, apiKey)
      setCommits(commitList)
    })()
  }, [versionControl, apiKey])

  const onCreateBackupClick = async () => {
    const commitList = await handleGetServices(versionControl, apiKey)
    if (commitList) setCommits(commitList)
  }

  return (
    <>
      <Bar
        className={classes.innerBarStyle}
        endContent={
          <>
            <Input
              value={gitToken}
              onChange={(e) => setGitToken(e.target.value)}
              placeholder="Git Token"
              type="Password"
              valueState="Information"
              valueStateMessage={<div>Insert your Git Token to use this tool</div>}
            />
            <Button id="backupButton" data-cy="backupButton" className={classes.singlePrettifyButton} onClick={onCreateBackupClick}>
              {t('VERSION_CONTROL.BACKUP')}
            </Button>
          </>
        }
      ></Bar>

      <div className={classes.commitsContainer}>
        <table className={classes.commitTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Message</th>
              <th>SHA</th>
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
                  <td>{new Date(commit.commit.committer.date).toLocaleString()}</td>
                  <td>{commit.commit.message}</td>
                  <td>{commit.sha}</td>
                  <td>
                    <Button id={`commitRevertButton-${index}`} className={classes.singlePrettifyButton} onClick={() => handleCommitRevertServices(versionControl, commit.sha)}>
                      {t('VERSION_CONTROL.RESTORE')}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default withTranslation()(VersionControlComponent)
