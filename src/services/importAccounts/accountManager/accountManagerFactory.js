/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { AccountType } from './accountType'
import FullAccount from './fullAccountManager'
import LiteAccount from './liteAccountManager'

class AccountManagerFactory {
  static create(accountType, storageProvider, template) {
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
