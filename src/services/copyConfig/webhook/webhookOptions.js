/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../options.js'

class WebhookOptions extends Options {
  #webhook

  constructor(webhook) {
    super({
      id: 'Webhooks',
      name: 'Webhooks',
      value: true,
      formatName: false,
      branches: [],
    })
    this.#webhook = webhook
  }

  getConfiguration() {
    return this.#webhook
  }

  addWebhooks(response) {
    const webhooks = response.webhooks
    this.options.branches = []
    if (webhooks.length === 0) {
      return
    }
    for (const webhook of webhooks) {
      this.options.branches.push({
        id: webhook.name,
        name: webhook.name,
        value: true,
        formatName: false,
      })
      this.#addLink(webhook.name)
    }
  }
  #addLink(name) {
    const collection = this.options.branches.find((collection) => collection.name === name)
    const optionName = 'Include Notification URL'
    if (collection) {
      collection.branches = []
      collection.branches.push({
        id: `${name}-Email-Link`,
        name: optionName,
        formatName: false,
        value: false,
      })
    }
  }
}

export default WebhookOptions
