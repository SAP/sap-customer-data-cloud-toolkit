/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { useEffect, useState } from 'react'
import { Dialog, Bar, Button, ValueState } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { withTranslation } from 'react-i18next'

import styles from './dialog-message-confirm.styles.js'
import { createPortal } from 'react-dom'

const useStyles = createUseStyles(styles, { name: 'DialogMessageConfirm' })

const DialogMessageConfirm = ({ children, open = true, state = ValueState.Error, confirmButtonClickHandler, confirmButtonText, disableSaveButton, t, ...otherProps }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(open)
  const classes = useStyles()

  useEffect(() => {
    setDialogIsOpen(open)
  }, [open])

  const onBeforeCloseHandler = (event) => {
    if (event.detail.escPressed) {
      event.preventDefault()
    }
  }

  return (
    <>
      {createPortal(
        <Dialog
          initialFocus="cancelButton"
          open={dialogIsOpen}
          state={state}
          className={classes.errorDialogStyle}
          footer={
            <Bar
              design="Header"
              endContent={
                <div>
                  <Button
                    id="confirmButton"
                    onClick={confirmButtonClickHandler}
                    design="Emphasized"
                    className={classes.confirmButtonStyle}
                    disabled={disableSaveButton ? disableSaveButton() : false}
                    data-cy="dialogMessageConfirmConfirmButton"
                  >
                    {confirmButtonText ? confirmButtonText : t('GLOBAL.CONTINUE')}
                  </Button>

                  <Button id="cancelButton" onClick={() => setDialogIsOpen(false)} className={classes.closeButtonStyle} data-cy="dialogMessageConfirmCancelButton">
                    {t('GLOBAL.CANCEL')}
                  </Button>
                </div>
              }
            />
          }
          onBeforeClose={onBeforeCloseHandler}
          {...otherProps}
        >
          {children}
        </Dialog>,
        document.body
      )}
    </>
  )
}

export default withTranslation()(DialogMessageConfirm)
