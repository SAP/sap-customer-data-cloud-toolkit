import { AccountType } from '../../accountManager/accountType'
import { azureFullAccountTemplate } from '../../serverImport/AzureAccountsTemplates/azureFullAccountTemplate'
import { azureLiteAccountTemplate } from '../../serverImport/AzureAccountsTemplates/azureLiteAccountTemplate'

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
