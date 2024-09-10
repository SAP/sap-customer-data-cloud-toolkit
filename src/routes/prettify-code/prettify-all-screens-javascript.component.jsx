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
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component.jsx'
const useStyles = createUseStyles(styles, { name: 'Prettier' })

const PrettifyAllScreens = ({ t }) => {
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
    const screenSet = getScreenSet(window.location)
    const prettier = new StringPrettierFormatter(credentialsUpdated, apikey, currentSiteInfo.dataCenter)
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
      }, 2000)
    }
  }
  const onAfterCloseErrorDialogHandle = () => {
    setShowError(false)
  }

  const showSuccessMessage = () => (
    <DialogMessageInform headerText={t('GLOBAL.SUCCESS')} state={ValueState.Success} id="successPopup" data-cy="prettierSuccessPopup">
      <Text>{t('PRETTIFY.SUCCESS')}</Text>
      <ul>
        {modifiedScreenSets.map((screenSetID) => (
          <li key={screenSetID}>{screenSetID}</li>
        ))}
      </ul>
    </DialogMessageInform>
  )

  const showErrorPopup = () => (
    <DialogMessageInform headerText={t('GLOBAL.ERROR')} state={ValueState.Error} id="errorPopup" data-cy="errorPopup" onAfterClose={onAfterCloseErrorDialogHandle}>
      <Text>{errorMessage}</Text>
    </DialogMessageInform>
  )
  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <>
            <Button id="prettifyAllCode" data-cy="prettifyAllCode" className={classes.prettifyAllButtons} onClick={getServices}>
              {t('PRETTIFY_ALL_BUTTONS.LABEL')}
            </Button>
          </>
        }
      ></Bar>
      {showSuccess && showSuccessMessage()}
      {showError && showErrorPopup()}
    </>
  )
}

export default withTranslation()(PrettifyAllScreens)
