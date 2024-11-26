import { withTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'

import VersionControl from '../../services/versionControl/versionControl.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { useSelector } from 'react-redux'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import styles from './version-control.styles.js'

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

  useEffect(() => {
    handleCommitListRequestServices()
  }, [])

  const handleGetServices = async () => {
    try {
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
      const commitList = await versionControl.getCommits()
      if (commitList.length > 0) {
        setCommits(commitList)
      } else {
        setCommits([]) // Ensure commits is at least an empty array
        console.error('No commits found')
      }
    } catch (error) {
      console.error('Error fetching commits:', error)
      setCommits([]) // Ensure commits is at least an empty array
    }
  }

  const handleCommitRevertServices = async (sha) => {
    try {
      await versionControl.applyCommitConfig(sha)
      alert('Configurations reverted successfully!')
    } catch (error) {
      console.error('Error reverting configurations:', error)
      alert('Failed to revert configurations. Please try again.')
    }
  }

  return (
    <>
      <Bar
        className={classes.innerBarStyle}
        endContent={
          <>
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
                      REV
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
