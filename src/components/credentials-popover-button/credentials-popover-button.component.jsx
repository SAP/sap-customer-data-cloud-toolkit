import { useRef } from 'react'
import { Button, ResponsivePopover, ButtonDesign, PopoverPlacementType } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import CredentialsPopover from '../credentials-popover/credentials-popover.component'
import './credentials-popover-button.component.css'

import '@ui5/webcomponents-icons/dist/fridge.js'

import { setIsPopUpOpen } from '../../redux/credentials/credentialsSlice'

const CredentialsPopoverButton = ({ t }) => {
  const dispatch = useDispatch()
  const ref = useRef()
  return (
    <>
      <Button
        id="openPopoverButton"
        className="fd-button fd-shellbar__button"
        onClick={(event) => {
          const responsivePopover = ref.current
          if (responsivePopover.isOpen()) {
            dispatch(setIsPopUpOpen(false))
            responsivePopover.close()
          } else {
            dispatch(setIsPopUpOpen(true))
            responsivePopover.showAt(event.target)
          }
        }}
        icon="fridge"
        tooltip={t('CREDENTIALS_POPOVER.CDCTOOLBOX')}
        design={ButtonDesign.Transparent}
      />
      <ResponsivePopover
        ref={ref}
        opener="openPopoverButton"
        placementType={PopoverPlacementType.Bottom}
        headerText={t('CREDENTIALS_POPOVER.CDCTOOLBOX')}
        style={{ minWidth: 300 }}
      >
        <CredentialsPopover />
      </ResponsivePopover>
    </>
  )
}

export default withNamespaces()(CredentialsPopoverButton)
