/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import React, { useState } from 'react'
import { Bar, Button, ValueState, Text } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './prettify-code.styles.js'
import StringPrettierFormatter from '../../services/prettierValidator/prettierFunction.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey, getScreenSet } from '../../redux/utils.js'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import PrettierErrorDialog from '../../components/prettify-error-dialog/prettify-error-dialog.component.jsx'
import PrettierSuccessDialog from '../../components/prettify-success-dialog/prettify-success-dialog.component.jsx'
const useStyles = createUseStyles(styles, { name: 'Prettier' })

const PrettifySingleScreen = ({ t }) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [modifiedScreenSets, setModifiedScreenSets] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const classes = useStyles()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const credentialsUpdated = { userKey: credentials.userKey, secret: credentials.secretKey, gigyaConsole: credentials.gigyaConsole }

  const getServices = async () => {
    const prettier = new StringPrettierFormatter(credentialsUpdated, apikey, currentSiteInfo.dataCenter)
    const screenSet = getScreenSet(window.location)
    const { success, screenSetArray, error } = await prettier.prettierCode(apikey, screenSet)

    if (error) {
      setErrorMessage(error)
      setShowSuccess(false)
      setShowError(true)
      return
    }
    if (success) {
      setShowSuccess(true)
      setModifiedScreenSets(screenSetArray)
      setTimeout(() => {
        setShowSuccess(false)
        window.location.reload()
      }, 3000)
    }
  }
  const onAfterCloseErrorDialogHandle = () => {
    setShowError(false)
  }
  const showSuccessMessage = () => <PrettierSuccessDialog modifiedScreenSets={modifiedScreenSets} />

  const showErrorPopup = () => <PrettierErrorDialog onAfterCloseHandle={onAfterCloseErrorDialogHandle} errorMessage={errorMessage} />
  return (
    <>
      <Bar
        className={classes.innerBarStyle}
        endContent={
          <>
            <Button id="prettifySingleScreen" data-cy="prettifySingleScreen" className={classes.singlePrettifyButton} onClick={getServices}>
              {t('PRETTIFY.BUTTON_LABEL')}
            </Button>
          </>
        }
      ></Bar>
      {showSuccess && showSuccessMessage()}
      {showError && showErrorPopup()}
    </>
  )
}

export default withTranslation()(PrettifySingleScreen)
