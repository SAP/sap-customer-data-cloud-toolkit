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
    }
  }
}

export default WebhookOptions
