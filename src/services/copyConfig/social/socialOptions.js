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

class SocialOptions extends Options {
  #social

  constructor(social) {
    super({
      id: 'socialIdentities',
      name: 'socialIdentities',
      value: true,
    })
    this.#social = social
  }

  getConfiguration() {
    return this.#social
  }

  removeSocialProviders(info) {
    info.branches = []
  }
}

export default SocialOptions
