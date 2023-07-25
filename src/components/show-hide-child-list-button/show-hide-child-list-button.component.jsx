/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


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
