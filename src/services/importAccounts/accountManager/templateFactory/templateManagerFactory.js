/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import AzureTemplateFactory from './azureTemplateFactory'

class TemplateFactory {
  static create(accountType, storageProvider) {
    switch (storageProvider) {
      case 'azure':
        return AzureTemplateFactory.make(accountType)
      default:
        return null
    }
  }
}

export default TemplateFactory
