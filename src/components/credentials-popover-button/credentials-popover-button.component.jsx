import { useRef, useEffect } from 'react'
import { Button, ResponsivePopover, ButtonDesign, PopoverPlacementType, Badge } from '@ui5/webcomponents-react'
import { useDispatch, useSelector } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { setIsPopUpOpen } from '../../redux/credentials/credentialsSlice'
import { selectIsNewReleaseAvailable, checkNewVersion } from '../../redux/version/versionSlice'

import CredentialsPopover from '../credentials-popover/credentials-popover.component'
import './credentials-popover-button.component.css'
import '@ui5/webcomponents-icons/dist/fridge.js'
import styles from './credentials-popover-button.styles.js'

const useStyles = createUseStyles(styles, { name: 'CredentialsPopoverButton' })

const CredentialsPopoverButton = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const ref = useRef()

  const isNewReleaseAvailable = useSelector(selectIsNewReleaseAvailable)

  useEffect(() => {
    dispatch(checkNewVersion())
  }, [dispatch])

  const openPopoverButtonClickHandler = (event) => {
    const responsivePopover = ref.current
    if (responsivePopover.isOpen()) {
      dispatch(setIsPopUpOpen(false))
      responsivePopover.close()
    } else {
      dispatch(setIsPopUpOpen(true))
      responsivePopover.showAt(event.target)
    }
  }

  return (
    <>
      <Button
        id="openPopoverButton"
        className="fd-button fd-shellbar__button"
        onClick={openPopoverButtonClickHandler}
        icon="fridge"
        tooltip={t('CREDENTIALS_POPOVER_BUTTON.CDCTOOLBOX')}
        design={ButtonDesign.Transparent}
      ></Button>

      {isNewReleaseAvailable ? (
        <Badge colorScheme="3" className={classes.badgeStyle}>
          !
        </Badge>
      ) : (
        ''
      )}

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
