import React, { useState, useEffect, useCallback } from 'react'
import { withTranslation } from 'react-i18next'
import { Bar, Input, Button, Dialog, TextArea, List, StandardListItem } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import Pagino from 'pagino'
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
  const [owner, setOwner] = useState(Cookies.get('owner') || '')
  const [commitMessage, setCommitMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [resultMessages, setResultMessages] = useState([])
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCommits = useCallback(async () => {
    if (gitToken && owner) {
      const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, owner)
      try {
        const { commitList, totalCommits } = await handleCommitListRequestServices(versionControl, apiKey, page, perPage)
        setCommits(commitList)
        setTotalPages(Math.ceil(totalCommits / perPage))
      } catch (error) {
        console.error('Error fetching commits:', error)
      }
    }
  }, [gitToken, owner, credentials, apiKey, currentSite, page, perPage])

  useEffect(() => {
    fetchCommits() // Fetch commits on initial render and when dependencies change
  }, [fetchCommits])

  const onCreateBackupClick = () => {
    setIsDialogOpen(true)
  }

  const onConfirmBackupClick = async () => {
    const versionControl = createVersionControlInstance(credentials, apiKey, currentSite, owner)
    try {
      const result = await handleGetServices(versionControl, apiKey, commitMessage)
      setResultMessages(result || [])
      setIsResultDialogOpen(true)
      await fetchCommits() // Refresh the commits list after confirmation
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

  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchCommits()
  }

  const handleResultDialogClose = () => {
    setIsResultDialogOpen(false)
  }

  const renderPagination = () => {
    const pagino = new Pagino({
      count: totalPages,
      page,
      siblingCount: 1,
      boundaryCount: 1,
      onChange: (newPage) => handlePageChange(newPage),
    })

    const pages = pagino.getPages()

    return (
      <div className={classes.paginationContainer}>
        {pages.map((pageNumber, index) => {
          if (pageNumber === 'first' || pageNumber === 'previous' || pageNumber === 'next' || pageNumber === 'last') {
            return (
              <button
                key={index}
                className={classes.paginationButton}
                onClick={() => pagino[pageNumber]()}
                disabled={(pageNumber === 'first' && page === 1) || (pageNumber === 'last' && page === totalPages)}
              >
                {pageNumber === 'first' ? 1 : pageNumber === 'last' ? totalPages : pageNumber === 'previous' ? '<' : '>'}
              </button>
            )
          } else if (pageNumber === 'start-ellipsis' || pageNumber === 'end-ellipsis') {
            return (
              <span key={index} className={classes.paginationEllipsis}>
                ...
              </span>
            )
          } else {
            return (
              <span key={index} className={pageNumber === page ? classes.paginationCurrentPage : classes.paginationPage} onClick={() => handlePageChange(pageNumber)}>
                {pageNumber}
              </span>
            )
          }
        })}
      </div>
    )
  }

  return (
    <>
      <h2>{t('VERSION_CONTROL.TITLE')}</h2>
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
            <Button onClick={onConfirmBackupClick}>{t('VERSION_CONTROL.CONFIRM')}</Button>
            <Button onClick={onCancelBackupClick}>{t('VERSION_CONTROL.CANCEL')}</Button>
          </>
        }
      >
        <TextArea value={commitMessage} onInput={handleCommitMessageChange} placeholder={t('VERSION_CONTROL.COMMIT_MESSAGE_PLACEHOLDER')} rows={4} />
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

      <div className={classes.commitsContainer}>
        <table className={classes.commitTable}>
          <thead>
            <tr>
              <th>{t('VERSION_CONTROL.ID')}</th>
              <th>{t('VERSION_CONTROL.DATE')}</th>
              <th>{t('VERSION_CONTROL.COMMIT_MESSAGE')}</th>
              <th>{t('VERSION_CONTROL.ACTION')}</th>
            </tr>
          </thead>
          <tbody>
            {commits.length === 0 ? (
              <tr>
                <td colSpan="4">{t('VERSION_CONTROL.NO_COMMITS')}</td>
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
      </div>
      <div>{renderPagination()}</div>
    </>
  )
}

export default withTranslation()(VersionControlComponent)
