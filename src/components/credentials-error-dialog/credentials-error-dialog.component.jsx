import { ValueState } from '@ui5/webcomponents-react'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import DialogMessage from '../../components/dialog-message-dialog/dialog-message.component'

import styles from './styles.js'

const useStyles = createUseStyles(styles, { name: 'CredentialsErrorDialog' })

const CredentialsErrorDialog = ({ open, onAfterCloseHandle, t }) => {
  const classes = useStyles()

  return (
    <DialogMessage
      open={open}
      headerText={t('GLOBAL.ERROR')}
      state={ValueState.Error}
      closeButtonContent="Ok"
      className={classes.dialogMessageStyle}
      onAfterClose={() => onAfterCloseHandle()}
      id="errorPopup"
    >
      {t('SITE_DEPLOYER_COMPONENT.INSERT_CREDENTIALS')}
    </DialogMessage>
  )
}

export default withNamespaces()(CredentialsErrorDialog)
