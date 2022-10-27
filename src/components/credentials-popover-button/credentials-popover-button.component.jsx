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
        onClick={(e) => {
          ref.current.showAt(e.target)
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
