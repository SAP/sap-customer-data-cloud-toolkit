/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import React from 'react'
import { Dialog, Button, Text, ValueState } from '@ui5/webcomponents-react'
import { withTranslation } from 'react-i18next'

const SuccessDialog = ({ open, onAfterClose, headerText, message, t }) => {
  return (
    <Dialog open={open} headerText={headerText} state={ValueState.Success} onAfterClose={onAfterClose} footer={<Button onClick={onAfterClose}>{t('GLOBAL.OK')}</Button>}>
      <Text>{message}</Text>
    </Dialog>
  )
}

export default withTranslation()(SuccessDialog)
