/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { createUseStyles } from 'react-jss'
import { withTranslation } from 'react-i18next'

import { Dialog, Button, Label } from '@ui5/webcomponents-react'

import styles from './import-popup.styles'

const useStyles = createUseStyles(styles, { name: 'ImportPopup' })

const ImportPopup = ({
  isImportPopupOpen,
  onCloseImportPopup,
  popupHeader,
  specifyFileLabel,
  onFileUploadButtonClickHandler,
  onImportButtonClickHandler,
  importFile,
  onCancelImportButtonClickHandler,
  t,
}) => {
  const classes = useStyles()

  return (
    <Dialog
      data-cy="importPopup"
      className="ui-dialog"
      open={isImportPopupOpen}
      onAfterClose={onCloseImportPopup}
      header={
        <div id="header" className={classes.headerOuterDivStyle}>
          <div className={classes.headerInnerDivStyle}>{popupHeader}</div>
          <div>
            <Button id="closeEmailImportPopup" icon="decline" onClick={onCloseImportPopup} design="Transparent" className="ui-dialog-titlebar-close"/>
          </div>
        </div>
      }
      children={
        <div>
          <div className={classes.specifyFileLableStyle}>
            <Label id="specifyFileLabel">{specifyFileLabel}</Label>
          </div>
          <div>
            <input data-cy="zipFileInput" type="file" accept="application/zip" onChange={onFileUploadButtonClickHandler}/>
          </div>
        </div>
      }
      footer={
        <div className={classes.footerOuterDivStyle}>
          <Button data-cy="importZipButton" className="btn dialog-button-1" onClick={onImportButtonClickHandler} disabled={!importFile}>
            {t('GLOBAL.IMPORT')}
          </Button>

          <Button data-cy="cancelImportZipButton" className="btn dialog-button-2" onClick={onCancelImportButtonClickHandler}>
            {t('GLOBAL.CANCEL')}
          </Button>
        </div>
      }
    />
  )
}

export default withTranslation()(ImportPopup)
