import { AccountType } from './accountType'
import FullAccount from './fullAccountManager'
import LiteAccount from './liteAccountManager'

class AccountManagerFactory {
  static getAccountManager(accountType, storageProvider, template) {
    switch (accountType) {
      case AccountType.Full:
        return new FullAccount(storageProvider, template)
      case AccountType.Lite:
        return new LiteAccount(storageProvider, template)
      default:
        throw new Error(`Unknown account type: ${accountType}`)
    }
  }
}

export default AccountManagerFactory
