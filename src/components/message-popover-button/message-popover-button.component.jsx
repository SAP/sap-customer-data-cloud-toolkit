/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { useRef } from 'react'
import { MessageViewButton, ResponsivePopover, ValueState } from '@ui5/webcomponents-react'

import MessageList from '../message-list/message-list.component'

const MessagePopoverButton = ({ message, type = ValueState.Error }) => {
  const ref = useRef()
  return (
    <>
      <MessageViewButton
        className="errorButton"
        type={type}
        onClick={(e) => {
          const responsivePopover = ref.current
          if (responsivePopover.isOpen()) {
            responsivePopover.close()
          } else {
            ref.current.showAt(e.target)
          }
        }}
      />
      <ResponsivePopover ref={ref}>
        <MessageList messages={Array.isArray(message) ? message : [message]} type={type} />
      </ResponsivePopover>
    </>
  )
}

export default MessagePopoverButton
