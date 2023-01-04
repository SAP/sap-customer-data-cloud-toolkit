import { useRef } from 'react'
import { Button, ResponsivePopover, ButtonDesign, PopoverPlacementType } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { setIsPopUpOpen } from '../../redux/credentials/credentialsSlice'

import CredentialsPopover from '../credentials-popover/credentials-popover.component'
import './credentials-popover-button.component.css'
import '@ui5/webcomponents-icons/dist/fridge.js'
import styles from './styles.js'

const useStyles = createUseStyles(styles, { name: 'CredentialsPopoverButton' })

const CredentialsPopoverButton = ({ t }) => {
  const classes = useStyles()
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
        tooltip={t('CREDENTIALS_POPOVER_BUTTON.CDCTOOLBOX')}
        design={ButtonDesign.Transparent}
      />
      <ResponsivePopover
        id="credentialsResponsivePopover"
        ref={ref}
        opener="openPopoverButton"
        placementType={PopoverPlacementType.Bottom}
        headerText={t('CREDENTIALS_POPOVER_BUTTON.CDCTOOLBOX')}
        className={classes.responsivePopoverStyle}
      >
        <CredentialsPopover />
      </ResponsivePopover>
    </>
  )
}

export default withNamespaces()(CredentialsPopoverButton)
