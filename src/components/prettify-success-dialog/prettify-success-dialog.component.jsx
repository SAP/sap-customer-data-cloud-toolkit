import { withTranslation } from 'react-i18next'
import { ValueState, Text } from '@ui5/webcomponents-react'
import DialogMessageInform from '../dialog-message-inform/dialog-message-inform.component'

const PrettierSuccessDialog = ({ onAfterCloseHandle, t, modifiedScreenSets }) => {
  return (
    <DialogMessageInform headerText={t('GLOBAL.SUCCESS')} state={ValueState.Success} id="successPopup" data-cy="prettierSuccessPopup" onAfterClose={onAfterCloseHandle}>
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
