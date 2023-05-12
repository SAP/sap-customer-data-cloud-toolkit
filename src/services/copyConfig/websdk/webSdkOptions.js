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

class WebSdkOptions extends Options {
  #webSdk

  constructor(webSdk) {
    super({
      id: 'webSdk',
      name: 'webSdk',
      value: true,
    })
    this.#webSdk = webSdk
  }

  getConfiguration() {
    return this.#webSdk
  }

  removeWebSdk(info) {
    info.branches = []
  }
}

export default WebSdkOptions
