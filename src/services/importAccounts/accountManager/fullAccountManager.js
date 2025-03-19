/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import AccountManager from './accountManager'

class FullAccount extends AccountManager {
  constructor(storageProvider, template) {
    super(storageProvider)
    this.template = template
    this.dataflow = this.#createDataflow()
  }

  #createDataflow() {
    return JSON.parse(this.template)
  }
}

export default FullAccount
