/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { AccountType } from '../accountType'
import { azureFullAccountTemplate } from '../serverImport/azureAccountsTemplates/azureFullAccountTemplate'
import { azureLiteAccountTemplate } from '../serverImport/azureAccountsTemplates/azureLiteAccountTemplate'

class AzureTemplateFactory {
  static make(accountType) {
    switch (accountType) {
      case AccountType.Full:
        return azureFullAccountTemplate
      case AccountType.Lite:
        return azureLiteAccountTemplate
      default:
        throw new Error(`Unable to find template for account type: ${accountType}`)
    }
  }
}

export default AzureTemplateFactory
