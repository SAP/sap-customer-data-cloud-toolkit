/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import React, { useState } from 'react'
import { Bar, Button, ValueState, Text } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './email-templates.styles.js'
import StringPrettierFormatter from '../../services/prettierValidator/prettierFunction.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey, getScreenSet } from '../../redux/utils.js'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component.jsx'
const useStyles = createUseStyles(styles, { name: 'Prettier' })

const CodeMirrorEditor = ({ t }) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showError, setShowError] = useState(false)
  const [modifiedScreenSets, setModifiedScreenSets] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const classes = useStyles()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)

  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const credentialsUpdated = { userKey: credentials.userKey, secret: credentials.secretKey, gigyaConsole: credentials.gigyaConsole }

  const getServices = async () => {
    console.log('window', window.location)
    const prettier = new StringPrettierFormatter(credentialsUpdated, apikey, currentSiteInfo.dataCenter)
    const screenSet = getScreenSet(window.location)
    const { success, screenSets, error } = await prettier.prettierCode(screenSet, apikey)
    if (error) {
      setErrorMessage(error)
      setShowSuccess(false)
      setShowInfo(false)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 2000)
      return
    }
    if (success) {
      setShowSuccess(true)
      setModifiedScreenSets(screenSets)
      setTimeout(() => {
        setShowSuccess(false)
        // window.location.reload()
      }, 2000)
    } else {
      setModifiedScreenSets(screenSets)
      setShowInfo(true)
      setTimeout(() => {
        setShowInfo(false)
        // window.location.reload()
      }, 2000)
    }
  }
  // const showSuccessMessage = () => (
  //   <DialogMessageInform headerText={t('GLOBAL.SUCCESS')} state={ValueState.Success} id="successPopup" data-cy="prettierSuccessPopup">
  //     <Text>{t('PRETTIFY.SUCCESS')}</Text>
  //   </DialogMessageInform>
  // )
  const InformationPopup = () => {
    return (
      <DialogMessageInform headerText={t('GLOBAL.SUCCESS')} state={ValueState.Success} id="infoPopup" data-cy="informationPopup">
        <Text>{t('PRETTIFY.MULTIPLE_SCREENS')}</Text>
        <ul>
          {modifiedScreenSets.map((screenSetID) => (
            <li key={screenSetID}>{screenSetID}</li>
          ))}
        </ul>
      </DialogMessageInform>
    )
  }
  const showErrorPopup = () => (
    <DialogMessageInform headerText={t('GLOBAL.ERROR')} state={ValueState.Error} id="errorPopup" data-cy="errorPopup">
      <Text>{errorMessage}</Text>
    </DialogMessageInform>
  )
  if (window.location.href.includes('uiBuilder?screenSetId')) {
    console.log('location', window.location.href)
  }
  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <>
            <Button id="prettifyCode" data-cy="prettifyCode" className={classes.importAllButtonStyle} onClick={getServices}>
              Prettify Javascript
            </Button>
          </>
        }
      ></Bar>
      {showSuccess && InformationPopup()}
      {showInfo && InformationPopup()}
      {showError && showErrorPopup()}
    </>
  )
}

export default withTranslation()(CodeMirrorEditor)
