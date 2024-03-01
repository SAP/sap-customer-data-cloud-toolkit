/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../options.js'

class ConsentOptions extends Options {
  #consentConfiguration

  constructor(consentConfiguration) {
    super({
      id: 'consent',
      name: 'consentStatements',
      value: true,
    })
    this.#consentConfiguration = consentConfiguration
  }

  getConfiguration() {
    return this.#consentConfiguration
  }
  addUrl() {
    const collection = this.options
    collection.branches = []
    collection.branches.push({
      id: 'legalStatements-URL',
      name: 'Include Documentation URL',
      value: false,
      formatName: false,
    })
  }

  removeConsent(info) {
    info.branches = []
  }
}

export default ConsentOptions
