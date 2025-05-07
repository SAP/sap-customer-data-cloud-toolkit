/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import LegalStatement from '../../copyConfig/consent/legalStatement.js'

class LegalStatementManager {
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.legalStatements = new LegalStatement(credentials, site, dataCenter)
  }

  async getFilteredLegalStatement(consentId, language) {
    let response = await this.legalStatements.get(consentId, language)
    if (response.errorCode === 0) {
      this.legalStatements.removeLegalStatementsWithStatus(response.legalStatements, 'Historic')
    }
    return response
  }
}

export default LegalStatementManager
