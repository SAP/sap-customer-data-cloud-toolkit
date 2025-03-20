/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { AccountType } from '../../accountManager/accountType'
import { azureFullAccountTemplate } from '../../serverImport/azureAccountsTemplates/azureFullAccountTemplate'
import { azureLiteAccountTemplates } from '../../serverImport/azureAccountsTemplates/azureLiteAccountTemplate'

class AzureTemplateFactory {
  static make(accountType) {
    switch (accountType) {
      case AccountType.Full:
        return azureFullAccountTemplate
      case AccountType.Lite:
        return azureLiteAccountTemplates
      default:
        throw new Error(`Unable to find template for account type: ${accountType}`)
    }
  }
}

export default AzureTemplateFactory
