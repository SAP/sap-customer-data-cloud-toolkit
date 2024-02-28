/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../options.js'

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
      if (extension.extensionFuncUrl) {
        this.#addLink(extension.extensionPoint)
      }
    }
  }
  #addLink(name) {
    const collection = this.options.branches.find((collection) => collection.name === name)
    const optionName = 'Include Extension URL'
    if (collection) {
      collection.branches = []
      collection.branches.push({
        id: `${name}-Extension-Link`,
        name: optionName,
        formatName: false,
        value: false,
      })
    }
  }
}

export default ExtensionOptions
