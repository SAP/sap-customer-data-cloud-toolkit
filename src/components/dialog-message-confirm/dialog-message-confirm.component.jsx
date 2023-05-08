import { useEffect, useState } from 'react'
import { Dialog, Bar, Button, ValueState } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { withTranslation } from 'react-i18next'

import styles from './dialog-message-confirm.styles.js'

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
      <Dialog
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
                  data-cy="confirmButton"
                  onClick={confirmButtonClickHandler}
                  design="Emphasized"
                  className={classes.confirmButtonStyle}
                  disabled={disableSaveButton ? disableSaveButton() : false}
                >
                  {confirmButtonText ? confirmButtonText : t('GLOBAL.CONTINUE')}
                </Button>

                <Button id="cancelButton" data-cy="cancelButton" onClick={() => setDialogIsOpen(false)} className={classes.closeButtonStyle}>
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
      </Dialog>
    </>
  )
}

export default withTranslation()(DialogMessageConfirm)
