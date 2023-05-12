/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
            <Button id="closeEmailImportPopup" icon="decline" onClick={onCloseImportPopup} design="Transparent" className="ui-dialog-titlebar-close"></Button>
          </div>
        </div>
      }
      children={
        <div>
          <div className={classes.specifyFileLableStyle}>
            <Label id="specifyFileLabel">{specifyFileLabel}</Label>
          </div>
          <div>
            <input data-cy="zipFileInput" type="file" accept="application/zip" onChange={onFileUploadButtonClickHandler}></input>
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
    ></Dialog>
  )
}

export default withTranslation()(ImportPopup)
