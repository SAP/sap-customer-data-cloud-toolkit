import { useEffect, useState } from 'react'
import { Dialog, Bar, Button, ValueState } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import { withTranslation } from 'react-i18next'

import styles from './dialog-message-confirm.styles.js'

const useStyles = createUseStyles(styles, { name: 'DialogMessageConfirm' })

const DialogMessageConfirm = ({ children, open = true, state = ValueState.Error, confirmButtonClickHandler, t, ...otherProps }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(open)
  const classes = useStyles()

  useEffect(() => {
    setDialogIsOpen(open)
  }, [open])

  return (
    <>
      <Dialog
        open={dialogIsOpen}
        state={state}
        className={classes.errorDialogStyle}
        footer={
          <Bar
            design="Footer"
            endContent={
              <div>
                <Button id="confirmButton" onClick={confirmButtonClickHandler} design="Emphasized" className={classes.confirmButtonStyle}>
                  {t('GLOBAL.CONTINUE')}
                </Button>

                <Button id="cancelButton" onClick={() => setDialogIsOpen(false)} className={classes.closeButtonStyle}>
                  {t('GLOBAL.CANCEL')}
                </Button>
              </div>
            }
          />
        }
        {...otherProps}
      >
        {children}
      </Dialog>
    </>
  )
}

export default withTranslation()(DialogMessageConfirm)
