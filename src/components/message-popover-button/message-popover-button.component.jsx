import { useRef } from 'react'
import { MessageViewButton, ResponsivePopover, ValueState } from '@ui5/webcomponents-react'

import MessageList from '../message-list/message-list.component'

const MessagePopoverButton = ({ message, type = ValueState.Error }) => {
  const ref = useRef()
  return (
    <>
      <MessageViewButton
        type={type}
        onClick={(e) => {
          ref.current.showAt(e.target)
        }}
      />
      <ResponsivePopover ref={ref}>
        <MessageList messages={[message]} />
      </ResponsivePopover>
    </>
  )
}

export default MessagePopoverButton
