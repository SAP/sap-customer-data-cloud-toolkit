/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { MessageItem } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/slim-arrow-right.js'

const MessageListItem = ({ message, type = 'Error' }) => {
  let { titleText, subtitleText } = message

  if (!titleText) {
    if (message.errorMessage) {
      titleText = message.errorMessage

      // Site deployer specific error message title
      if (message.site && message.site.baseDomain && message.site.dataCenter) {
        titleText += ` (${message.site.baseDomain} - ${message.site.dataCenter})`
      }
    }
  }
  if (!subtitleText) {
    if (message.errorDetails) {
      subtitleText = message.errorDetails
    }
  }

  return (
    <MessageItem titleText={titleText} data-cy="messageItem" subtitleText={subtitleText} type={type}>
      <pre>{JSON.stringify(message, null, 2)}</pre>
    </MessageItem>
  )
}
export default MessageListItem
