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

  removeConsent(info) {
    info.branches = []
  }
}

export default ConsentOptions