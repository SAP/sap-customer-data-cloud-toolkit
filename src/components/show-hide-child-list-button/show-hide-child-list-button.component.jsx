import { withTranslation } from 'react-i18next'
import { Button } from '@ui5/webcomponents-react'

const ShowHideChildListButton = ({ icon, tooltipKey, onClickHandler, t }) => {
  return (
    <>
      <Button
        icon={icon}
        design="Transparent"
        tooltip={t(tooltipKey)}
        onClick={() => {
          onClickHandler()
        }}
      ></Button>
    </>
  )
}

export default withTranslation()(ShowHideChildListButton)
