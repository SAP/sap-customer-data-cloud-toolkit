/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { List } from '@ui5/webcomponents-react'
import TargetApiKeyItem from '../target-api-key-item/target-api-key-item.component'

const TargetApiKeysList = ({ targetSites, onTarketApiKeyDeleteHandler }) => {
  return (
    <List id="selectedTargetApiKeysList" data-cy="selectedTargetApiKeysList" mode="Delete" onItemDelete={onTarketApiKeyDeleteHandler}>
      {targetSites.map((targetSite) => (
        <TargetApiKeyItem key={targetSite.apiKey} targetSite={targetSite} data-apikey={targetSite.apiKey} />
      ))}
    </List>
  )
}

export default TargetApiKeysList
