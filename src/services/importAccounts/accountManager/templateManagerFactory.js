import { AccountType } from './accountType'
import { azureFullAccountTemplate } from '../serverImport/AzureAccountsTemplates/azureFullAccountTemplate'
import { azureLiteAccountTemplate } from '../serverImport/AzureAccountsTemplates/azureLiteAccountTemplate'

class TemplateFactory {
  static getTemplate(accountType, storageProvider) {
    switch (storageProvider) {
      case 'azure':
        switch (accountType) {
          case AccountType.Full:
            return azureFullAccountTemplate
          case AccountType.Lite:
            return azureLiteAccountTemplate
          default:
            return null
        }
      default:
        return null
    }
  }
}

export default TemplateFactory
