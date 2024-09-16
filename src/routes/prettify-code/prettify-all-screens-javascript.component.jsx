/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React from 'react'
import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './prettify-code.styles.js'
import PrettierErrorDialog from '../../components/prettify-error-dialog/prettify-error-dialog.component.jsx'
import PrettierSuccessDialog from '../../components/prettify-success-dialog/prettify-success-dialog.component.jsx'
import { useCommonState, onAfterCloseErrorDialogHandle, onAfterCloseInformationDialogHandle, onAfterCloseSuccessDialogHandle } from './useCommonState.js'
import PrettierNoJavascriptMultipleScreenSets from '../../components/prettify-no-javascript-all-screen-set-dialog/prettify-no-javascript-all-screen-set-dialog.component.jsx'
import { getServices } from './handleServices.js'

const useStyles = createUseStyles(styles, { name: 'Prettier' })

const PrettifyAllScreens = ({ t }) => {
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
    setscreenSet,
    apikey,
    currentSiteInfo,
    credentialsUpdated,
  } = useCommonState()

  const handleGetServices = () =>
    getServices({
      credentialsUpdated,
      apikey,
      currentSiteInfo,
      setShowSuccess,
      setscreenSet,
      setShowInfo,
      setShowError,
      setErrorMessage,
      setModifiedScreenSets,
    })

  const showSuccessMessage = () => <PrettierSuccessDialog onAfterCloseHandle={() => onAfterCloseSuccessDialogHandle({ setShowSuccess })} modifiedScreenSets={modifiedScreenSets} />
  const showInformationPopUp = () => <PrettierNoJavascriptMultipleScreenSets onAfterCloseHandle={() => onAfterCloseInformationDialogHandle({ setShowInfo })} />
  const showErrorPopup = () => <PrettierErrorDialog onAfterCloseHandle={() => onAfterCloseErrorDialogHandle({ setShowError })} errorMessage={errorMessage} />
  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <>
            <Button id="prettifyAllCode" data-cy="prettifyAllCode" className={classes.prettifyAllButtons} onClick={handleGetServices}>
              {t('PRETTIFY_ALL_BUTTONS.LABEL')}
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

export default withTranslation()(PrettifyAllScreens)
