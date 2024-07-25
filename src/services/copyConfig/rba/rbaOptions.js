/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../options.js'

export default class RbaOptions extends Options {
  static ACCOUNT_TAKEOVER_PROTECTION = 'accountTakeoverProtection'
  static UNKNOWN_LOCATION_NOTIFICATION = 'unknownLocationNotification'
  static RULES = 'RBA Rules'
  #rba

  constructor(rba) {
    super({
      id: 'rba',
      name: 'riskBasedAuthentication',
      value: true,
      branches: [
        {
          id: RbaOptions.ACCOUNT_TAKEOVER_PROTECTION,
          name: RbaOptions.ACCOUNT_TAKEOVER_PROTECTION,
          value: true,
        },
        {
          id: `p${RbaOptions.UNKNOWN_LOCATION_NOTIFICATION}`,
          name: RbaOptions.UNKNOWN_LOCATION_NOTIFICATION,
          value: true,
        },
        {
          id: RbaOptions.RULES,
          name: RbaOptions.RULES,
          formatName: false,
          value: true,
          operation: RbaOptions.operation,
        },
      ],
    })
    this.#rba = rba
  }

  getConfiguration() {
    return this.#rba
  }

  removeRules(info) {
    return this.removeInfo(RbaOptions.RULES, info)
  }

  getOptionOperation(id) {
    const option = this.options.branches.find((branch) => branch.id === id)
    return option ? option.operation : 'merge'
  }
}
