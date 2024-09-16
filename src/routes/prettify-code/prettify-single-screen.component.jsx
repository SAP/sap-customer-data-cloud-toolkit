/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React from 'react'
import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './prettify-code.styles.js'
import PrettierFormatter from '../../services/prettierFormatter/prettierFormatter.js'
import { getScreenSet } from '../../redux/utils.js'
import PrettierErrorDialog from '../../components/prettify-error-dialog/prettify-error-dialog.component.jsx'
import PrettierSuccessDialog from '../../components/prettify-success-dialog/prettify-success-dialog.component.jsx'
import { useCommonState, onAfterCloseErrorDialogHandle, onAfterCloseInformationDialogHandle, onAfterCloseSuccessDialogHandle } from './useCommonState.js'
import PrettifyNoJavascriptDialogComponent from '../../components/prettify-no-javascript-dialog/prettify-no-javascript-dialog.component.jsx'

const useStyles = createUseStyles(styles, { name: 'Prettier' })

const PrettifySingleScreen = ({ t }) => {
  const classes = useStyles()
  const {
    showSuccess,
    setShowSuccess,
    showError,
    setShowError,
    modifiedScreenSets,
    setModifiedScreenSets,
    errorMessage,
    setErrorMessage,
    showInfo,
    setShowInfo,
    screenSet,
    setscreenSet,
    apikey,
    currentSiteInfo,
    credentialsUpdated,
  } = useCommonState()

  const getServices = async () => {
    const prettier = new PrettierFormatter(credentialsUpdated, apikey, currentSiteInfo.dataCenter)
    let screenSet = getScreenSet(window.location)
    const { success, screenSetArray, error } = await prettier.formatScreenSets(apikey, screenSet)
    if (screenSetArray.length === 0 && error === null) {
      setscreenSet(screenSet)
      setShowSuccess(false)
      setShowInfo(true)
      return
    }

    if (error) {
      setErrorMessage(error)
      setShowSuccess(false)
      setShowError(true)
      return
    }
    if (success) {
      setShowSuccess(true)
      setModifiedScreenSets(screenSetArray)
    }
  }

  const showSuccessMessage = () => <PrettierSuccessDialog onAfterCloseHandle={() => onAfterCloseSuccessDialogHandle({ setShowSuccess })} modifiedScreenSets={modifiedScreenSets} />
  const showErrorPopup = () => <PrettierErrorDialog onAfterCloseHandle={() => onAfterCloseErrorDialogHandle({ setShowError })} errorMessage={errorMessage} />
  const showInformationPopUp = () => <PrettifyNoJavascriptDialogComponent onAfterCloseHandle={() => onAfterCloseInformationDialogHandle} screenSet={screenSet} />
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
      {showInfo && showInformationPopUp()}
      {showError && showErrorPopup()}
    </>
  )
}

export default withTranslation()(PrettifySingleScreen)
