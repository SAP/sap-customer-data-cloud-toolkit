import { MessageView } from '@ui5/webcomponents-react'

import MessageListItem from '../message-list-item/message-list-item.component'
import { generateUUID } from '../../utils/generateUUID'

const MessageList = ({ messages }) => {
  return (
    <MessageView
      id="messageList"
      showDetailsPageHeader={true}
      onItemSelect={(e) => {
        // Fix to add horizontal scroll to message details
        const messageViewElem = e.target.parentElement.parentElement
        setTimeout(() => (messageViewElem.querySelectorAll(':scope > div:nth-child(2) > div')[0].style.overflowX = 'auto'), 1)
      }}
    >
      {messages.map((message) => (
        <MessageListItem key={message.callId ? message.callId : generateUUID()} message={message} />
      ))}
    </MessageView>
  )
}

export default MessageList
