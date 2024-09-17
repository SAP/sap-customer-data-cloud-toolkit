import { withTranslation } from 'react-i18next'
import { ValueState, Text } from '@ui5/webcomponents-react'
import DialogMessageInform from '../dialog-message-inform/dialog-message-inform.component'

const PrettierNoJavascriptDialog = ({ onAfterCloseHandle, t, screenSet }) => {
  return (
    <DialogMessageInform
      headerText={t('PRETTIFY_SINGLE_SCREEN_INFORMATIONAL_NO_JAVASCRIPT')}
      state={ValueState.Information}
      id="noJavascriptPopUp"
      data-cy="noJavascriptPopUp"
      onAfterClose={onAfterCloseHandle}
    >
      <Text>
        {t('PRETTIFY_SINGLE_SCREEN_SET_NO_JAVASCRIPT.LABEL')} : {screenSet}.
      </Text>
    </DialogMessageInform>
  )
}

export default withTranslation()(PrettierNoJavascriptDialog)
