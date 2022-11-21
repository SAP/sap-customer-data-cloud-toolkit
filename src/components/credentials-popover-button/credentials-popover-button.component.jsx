import { useRef } from 'react'
import { Button, ResponsivePopover, ButtonDesign, PopoverPlacementType } from '@ui5/webcomponents-react'

import CredentialsPopover from '../credentials-popover/credentials-popover.component'
import './credentials-popover-button.component.css'

import '@ui5/webcomponents-icons/dist/fridge.js'

const CredentialsPopoverButton = () => {
  const ref = useRef()
  return (
    <>
      <Button
        id="openPopoverButton"
        className="fd-button fd-shellbar__button"
        onClick={(event) => {
          const responsivePopover = ref.current
          if (responsivePopover.isOpen()) {
            responsivePopover.close()
          } else {
            responsivePopover.showAt(event.target)
          }
        }}
        icon="fridge"
        tooltip="CDC Toolbox"
        design={ButtonDesign.Transparent}
      />
      <ResponsivePopover ref={ref} opener="openPopoverButton" placementType={PopoverPlacementType.Bottom} headerText="CDC Toolbox" style={{ minWidth: 300 }}>
        <CredentialsPopover />
      </ResponsivePopover>
    </>
  )
}

export default CredentialsPopoverButton
