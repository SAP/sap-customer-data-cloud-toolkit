/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
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
  // const configurations = useSelector(selectConfigurations)
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }
  const versionControl = new VersionControl(credentialsUpdated, apikey, currentSite)
  const [commits, setCommits] = useState([])

  useEffect(() => {
    handleCommitListRequestServices()
  })

  // const handleGetServices = async () => {
  //   console.log('currentSite', currentSite)
  //   await versionControl.writeFile()
  // }

  const handleGetServices = async () => {
    try {
      await versionControl.writeFile()
      alert('Backup created successfully!')
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Failed to create backup. Please try again.')
    }
  }

  // const handleRevertServices = async () => {
  //   await versionControl.readFile()
  // }
  // const handlePullRequestCheckServices = async () => {
  //   await versionControl.checkAndCreatePullRequest()
  // }
  // const handlePullRequestServices = async () => {
  //   await versionControl.createPullRequest()
  // }
  const handleCommitListRequestServices = async () => {
    const commitList = await versionControl.getCommits()
    if (commitList) {
      setCommits(commitList)
    } else {
      setCommits([]) // Ensure commits is at least an empty array
      console.error('Failed to fetch commits')
    }
  }
  const handleCommitRevertServices = async (sha) => {
    await versionControl.readCommit(sha)
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
            {/* <Button id="revertButton" data-cy="revertButton" className={classes.singlePrettifyButton} onClick={handleRevertServices}>
              {t('VERSION_CONTROL.REVERT')}
              </Button> */}
            {/* <Button id="checkPullRequestButton" data-cy="checkPullRequestButton" className={classes.singlePrettifyButton} onClick={handlePullRequestCheckServices}>
              Check and create Pull request
             
            </Button> */}
            {/* <Button id="createPullRequestButton" data-cy="createPullRequestButton" className={classes.singlePrettifyButton} onClick={handlePullRequestServices}>
              create Pull request
              
            </Button> */}
            <Button id="commitListButton" data-cy="commitListButton" className={classes.singlePrettifyButton} onClick={handleCommitListRequestServices}>
              Reresh commits
              {/* //TODO translate and use it */}
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
                  <td>{commit.commit.committer.date}</td>
                  <td>{commit.commit.message}</td>
                  <td>{commit.sha}</td>
                  <td>
                    <Button id={`commitRevertButton-${index}`} className={classes.singlePrettifyButton} onClick={() => handleCommitRevertServices(commit.sha)}>
                      REV
                      {/* //TODO translate and use it */}
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
