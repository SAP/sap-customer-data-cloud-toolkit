/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useRef } from 'react'
import { Button, ResponsivePopover, ButtonDesign, PopoverPlacementType } from '@ui5/webcomponents-react'
import { useDispatch } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { setIsPopUpOpen } from '../../redux/credentials/credentialsSlice'

import CredentialsPopover from '../credentials-popover/credentials-popover.component'
import './credentials-popover-button.component.css'
import '@ui5/webcomponents-icons/dist/fridge.js'
import styles from './credentials-popover-button.styles.js'

const useStyles = createUseStyles(styles, { name: 'CredentialsPopoverButton' })

const CredentialsPopoverButton = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const ref = useRef()

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
        data-cy="openPopoverButton"
        className="fd-button fd-shellbar__button"
        onClick={openPopoverButtonClickHandler}
        icon="fridge"
        tooltip={t('CREDENTIALS_POPOVER_BUTTON.CDCTOOLBOX')}
        design={ButtonDesign.Transparent}
      ></Button>

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

export default withTranslation()(CredentialsPopoverButton)
