/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { ValueState, Text } from '@ui5/webcomponents-react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'

import styles from './credentials-error-dialog.styles.js'

const useStyles = createUseStyles(styles, { name: 'CredentialsErrorDialog' })

const CredentialsErrorDialog = ({ open, onAfterCloseHandle, t }) => {
  const classes = useStyles()

  return (
    <DialogMessageInform
      open={open}
      headerText={t('GLOBAL.ERROR')}
      state={ValueState.Error}
      closeButtonContent={t('GLOBAL.OK')}
      className={classes.dialogMessageStyle}
      onAfterClose={() => onAfterCloseHandle()}
      id="errorPopup"
      data-cy="credentialErrorPopup"
    >
      <Text>{t('SITE_DEPLOYER_COMPONENT.INSERT_CREDENTIALS')}</Text>
    </DialogMessageInform>
  )
}

export default withTranslation()(CredentialsErrorDialog)
