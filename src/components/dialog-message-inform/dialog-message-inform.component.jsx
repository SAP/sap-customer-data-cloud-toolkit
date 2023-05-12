/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
