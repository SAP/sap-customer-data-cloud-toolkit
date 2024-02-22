/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../options.js'

export default class RbaOptions extends Options {
  static ACCOUNT_TAKEOVER_PROTECTION = 'accountTakeoverProtection'
  static UNKNOWN_LOCATION_NOTIFICATION = 'unknownLocationNotification'
  static RBA_RULES = 'rbaRules'
  static SETTINGS = 'settings'
  #rba

  constructor(rba) {
    super({
      id: 'rba',
      name: 'rba',
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
          id: RbaOptions.RBA_RULES,
          name: RbaOptions.RBA_RULES,
          value: true,
        },
        {
          id: RbaOptions.SETTINGS,
          name: RbaOptions.SETTINGS,
          value: true,
        },
      ],
    })
    this.#rba = rba
  }

  getConfiguration() {
    return this.#rba
  }

  removeRbaRules(info) {
    return this.removeInfo(RbaOptions.RBA_RULES, info)
  }
}
