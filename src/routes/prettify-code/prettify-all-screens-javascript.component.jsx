/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React from 'react'
import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './prettify-code.styles.js'
import StringPrettierFormatter from '../../services/prettierValidator/prettierFunction.js'
import { getScreenSet } from '../../redux/utils.js'
import PrettierErrorDialog from '../../components/prettify-error-dialog/prettify-error-dialog.component.jsx'
import PrettierSuccessDialog from '../../components/prettify-success-dialog/prettify-success-dialog.component.jsx'
import useCommonState from './useCommonState.js'
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
    apikey,
    currentSiteInfo,
    credentialsUpdated,
  } = useCommonState()

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

  const showSuccessMessage = () => <PrettierSuccessDialog modifiedScreenSets={modifiedScreenSets} />

  const showErrorPopup = () => <PrettierErrorDialog onAfterCloseHandle={onAfterCloseErrorDialogHandle} errorMessage={errorMessage} />
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
