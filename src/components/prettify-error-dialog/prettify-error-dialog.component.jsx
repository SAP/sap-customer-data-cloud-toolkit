import { withTranslation } from 'react-i18next'
import { ValueState, Text } from '@ui5/webcomponents-react'
import DialogMessageInform from '../dialog-message-inform/dialog-message-inform.component'
const PrettierErrorDialog = ({ onAfterCloseHandle, t, errorMessage }) => {
  return (
    <DialogMessageInform headerText={t('GLOBAL.ERROR')} state={ValueState.Error} id="errorPopup" data-cy="errorPopup" onAfterClose={onAfterCloseHandle}>
      <Text>{errorMessage}</Text>
    </DialogMessageInform>
  )
}
export default withTranslation()(PrettierErrorDialog)
