import { useRef } from 'react'
import { Button, ResponsivePopover } from '@ui5/webcomponents-react'

import CredentialsPopup from '../credentials-popup/credentials-popup.component'

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
      />
      <ResponsivePopover ref={ref} opener="openPopoverButton">
        <CredentialsPopup />
      </ResponsivePopover>
    </>
  )
}

export default CredentialsPopoverButton
