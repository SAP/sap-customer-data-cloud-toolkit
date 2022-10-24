import { MessageItem } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/slim-arrow-right.js'

const MessageListItem = ({ message }) => {
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
    <MessageItem titleText={titleText} subtitleText={subtitleText}>
      <pre>{JSON.stringify(message, null, 2)}</pre>
    </MessageItem>
  )
}
export default MessageListItem
