/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React from 'react'
import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './email-templates.styles.js'
import VersionControl, { readFile, writeFile } from '../../services/versionControl/versionControl.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { useSelector } from 'react-redux'
import { selectConfigurations, selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'

const useStyles = createUseStyles(styles, { name: 'Prettier' })

const VersionControlComponent = ({ t }) => {
  const classes = useStyles()
  const currentSite = useSelector(selectCurrentSiteInformation)

  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const configurations = useSelector(selectConfigurations)
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }
  const versionControl = new VersionControl(credentialsUpdated, apikey, currentSite)
  const handleGetServices = () => {
    console.log('currentSite', currentSite)

    versionControl.writeFile(credentialsUpdated, apikey, currentSite)
  }

  return (
    <>
      <Bar
        className={classes.innerBarStyle}
        endContent={
          <>
            <Button id="prettifySingleScreen" data-cy="prettifySingleScreen" className={classes.singlePrettifyButton} onClick={handleGetServices}>
              {t('PRETTIFY.BUTTON_LABEL')}
            </Button>
          </>
        }
      ></Bar>
    </>
  )
}

export default withTranslation()(VersionControlComponent)
