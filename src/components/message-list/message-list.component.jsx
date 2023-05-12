/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { MessageView } from '@ui5/webcomponents-react'

import MessageListItem from '../message-list-item/message-list-item.component'
import { generateUUID } from '../../utils/generateUUID'

const MessageList = ({ messages, type }) => {
  return (
    <MessageView
      id="messageList"
      data-cy="messageList"
      showDetailsPageHeader={true}
      onItemSelect={(e) => {
        // Fix to add horizontal scroll to message details
        const messageViewElem = e.target.parentElement.parentElement
        setTimeout(() => (messageViewElem.querySelectorAll(':scope > div:nth-child(2) > div')[0].style.overflowX = 'auto'), 1)
      }}
    >
      {messages.map((message) => (
        <MessageListItem key={message.callId ? message.callId : generateUUID()} message={message} type={message.severity} />
      ))}
    </MessageView>
  )
}

export default MessageList
