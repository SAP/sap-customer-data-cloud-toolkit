import { useEffect, useState } from 'react'
import { Dialog, Bar, Button, ValueState } from '@ui5/webcomponents-react'

const DialogMessage = ({ children, open = true, state = ValueState.Error, closeButtonContent = 'Close', ...otherProps }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(open)

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
              <Button onClick={() => setDialogIsOpen(false)} design="Emphasized" style={{ minWidth: '70px', maxHeight: '30px' }}>
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

export default DialogMessage
