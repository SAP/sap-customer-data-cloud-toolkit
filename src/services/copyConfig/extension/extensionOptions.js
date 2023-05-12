/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import Options from '../options'

class ExtensionOptions extends Options {
  #extension

  constructor(extension) {
    super({
      id: 'Extensions',
      name: 'Extensions',
      value: true,
      formatName: false,
      branches: [],
    })
    this.#extension = extension
  }

  getConfiguration() {
    return this.#extension
  }

  addExtensions(response) {
    const extensions = response.result
    this.options.branches = []
    if (extensions.length === 0) {
      return
    }
    for (const extension of extensions) {
      this.options.branches.push({
        id: extension.extensionPoint,
        name: extension.extensionPoint,
        value: true,
        formatName: false,
      })
    }
  }
}

export default ExtensionOptions
