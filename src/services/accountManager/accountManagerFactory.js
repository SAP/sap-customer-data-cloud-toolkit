import FullAccount from './fullAccountManager'
import LiteAccount from './liteAccountManager'

class AccountManagerFactory {
  static getAccountManager(accountType, storageProvider) {
    switch (accountType) {
      case 'Full':
        return new FullAccount(storageProvider)
      case 'Lite':
        return new LiteAccount(storageProvider)
      default:
        throw new Error(`Unknown account type: ${accountType}`)
    }
  }
}

export default AccountManagerFactory
