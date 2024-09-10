import { withTranslation } from 'react-i18next'
import { ValueState, Text } from '@ui5/webcomponents-react'
import DialogMessageInform from '../dialog-message-inform/dialog-message-inform.component'
const PrettierSuccessDialog = ({ t, modifiedScreenSets }) => {
  return (
    <DialogMessageInform headerText={t('GLOBAL.SUCCESS')} state={ValueState.Success} id="successPopup" data-cy="prettierSuccessPopup">
      <Text>{t('PRETTIFY.SUCCESS')}</Text>
      <ul>
        {modifiedScreenSets.map((screenSetID) => (
          <li key={screenSetID}>{screenSetID}</li>
        ))}
      </ul>
    </DialogMessageInform>
  )
}
export default withTranslation()(PrettierSuccessDialog)
