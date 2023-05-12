/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
