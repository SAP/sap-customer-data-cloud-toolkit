import { ValueState } from '@ui5/webcomponents-react'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'

import styles from './styles.js'

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
    >
      {t('SITE_DEPLOYER_COMPONENT.INSERT_CREDENTIALS')}
    </DialogMessageInform>
  )
}

export default withNamespaces()(CredentialsErrorDialog)
