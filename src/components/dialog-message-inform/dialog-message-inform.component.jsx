/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { useEffect, useState } from 'react'
import { Dialog, Bar, Button, ValueState } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'

import styles from './dialog-message-inform.styles.js'

const useStyles = createUseStyles(styles, { name: 'DialogMessage' })

const DialogMessageInform = ({ children, open = true, state = ValueState.Error, closeButtonContent = 'Close', ...otherProps }) => {
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
        footer={
          <Bar
            design="Footer"
            endContent={
              <Button id="closeButton" onClick={() => setDialogIsOpen(false)} design="Emphasized" className={classes.closeButtonStyle}>
                {closeButtonContent}
              </Button>
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

export default DialogMessageInform
