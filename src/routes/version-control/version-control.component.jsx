import React, { useState, useEffect } from 'react'
import { withTranslation } from 'react-i18next'
import { Bar, Input, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import VersionControl from '../../services/versionControl/versionControl'
import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { getApiKey } from '../../redux/utils'
import { useSelector } from 'react-redux'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'
import styles from './version-control.styles'

const useStyles = createUseStyles(styles, { name: 'Prettier' })

const VersionControlComponent = ({ t }) => {
  const classes = useStyles()
  const currentSite = useSelector(selectCurrentSiteInformation)
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }

  const versionControl = new VersionControl(credentialsUpdated, apikey, currentSite)
  const [commits, setCommits] = useState([])
  const [gitToken, setGitToken] = useState('')

  useEffect(() => {
    handleCommitListRequestServices()
  }, [])

  const handleGetServices = async () => {
    try {
      await versionControl.createBranch(apikey) // Ensure branch creation based on apiKey
      await versionControl.storeCdcDataInGit('Backup created')
      alert('Backup created successfully!')
      handleCommitListRequestServices() // Optional: refresh commits after backup
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Failed to create backup. Please try again.')
    }
  }

  const handleCommitListRequestServices = async () => {
    try {
      const hasBranch = await versionControl.branchExists(apikey) // Check if branch exists
      if (hasBranch) {
        const commitList = await versionControl.getCommits()
        if (commitList.length > 0) {
          setCommits(commitList)
        } else {
          setCommits([]) // Ensure commits are at least an empty array
          console.error('No commits found')
        }
      } else {
        setCommits([]) // No branch found, no commits to display
        console.warn(`No branch found for API key: ${apikey}`)
      }
    } catch (error) {
      console.error('Error fetching commits:', error)
      setCommits([]) // Ensure commits is at least an empty array
    }
  }

  const handleCommitRevertServices = async (sha) => {
    try {
      await versionControl.applyCommitConfig(sha)
    } catch (error) {
      console.error('Error reverting configurations:', error)
    }
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
            <Button id="backupButton" data-cy="backupButton" className={classes.singlePrettifyButton} onClick={handleGetServices}>
              {t('VERSION_CONTROL.BACKUP')}
            </Button>
            <Button id="commitListButton" data-cy="commitListButton" className={classes.singlePrettifyButton} onClick={handleCommitListRequestServices}>
              Refresh commits
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
                    <Button id={`commitRevertButton-${index}`} className={classes.singlePrettifyButton} onClick={() => handleCommitRevertServices(commit.sha)}>
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
