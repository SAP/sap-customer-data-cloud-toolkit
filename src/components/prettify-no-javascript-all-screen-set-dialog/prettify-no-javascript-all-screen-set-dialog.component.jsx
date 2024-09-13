import { withTranslation } from 'react-i18next'
import { ValueState, Text } from '@ui5/webcomponents-react'
import DialogMessageInform from '../dialog-message-inform/dialog-message-inform.component'

const PrettierNoJavascriptMultipleScreenSets = ({ onAfterCloseHandle, t }) => {
  return (
    <DialogMessageInform
      headerText={t('PRETTIFY_ALL_SCREEN_SETS_NO_JAVASCRIPT.LABEL')}
      state={ValueState.Information}
      id="noJavascriptPopUp"
      data-cy="noJavascriptPopUp"
      onAfterClose={onAfterCloseHandle}
    >
      <Text>{t('PRETTIFY_ALL_SCREEN-SETS_INFORMATIONAL_NO_JAVASCRIPT')}</Text>
    </DialogMessageInform>
  )
}

export default withTranslation()(PrettierNoJavascriptMultipleScreenSets)
