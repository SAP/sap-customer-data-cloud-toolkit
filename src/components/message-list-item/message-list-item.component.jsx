/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
