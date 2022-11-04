import { useRef } from 'react'
import { Button, ResponsivePopover } from '@ui5/webcomponents-react'

import CredentialsPopup from '../credentials-popup/credentials-popup.component'
import './credentials-popover-button.component.css'

import '@ui5/webcomponents-icons/dist/fridge.js'

const CredentialsPopoverButton = () => {
  const ref = useRef()
  return (
    <>
      <Button
        id="openPopoverButton"
        onClick={(event) => {
          const responsivePopover = ref.current
          if (responsivePopover.isOpen()) {
            responsivePopover.close()
          } else {
            responsivePopover.showAt(event.target)
          }
        }}
        icon="fridge"
        tooltip="Credentials"
      />
      <ResponsivePopover ref={ref} opener="openPopoverButton" style={{ padding: '0' }}>
        <CredentialsPopup />
      </ResponsivePopover>
    </>
  )
}

export default CredentialsPopoverButton
