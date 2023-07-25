/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
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
