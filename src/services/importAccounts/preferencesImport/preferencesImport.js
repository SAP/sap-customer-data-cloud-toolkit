/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import ConsentStatement from '../../copyConfig/consent/consentStatement'
import { extractAndTransformPreferencesFields } from './transformPreferencesFields'

class PreferencesImportFields {
  #credentials
  #site
  #dataCenter
  #preferences
  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#preferences = new ConsentStatement(credentials, site, dataCenter)
  }
  async getPreferencesData() {
    const preferencesResponse = await this.getPreferences()
    if (preferencesResponse.errorCode === 0) {
      this.cleanPreferencesResponse(preferencesResponse)
    }
    return preferencesResponse
  }
  async exportTransformedPreferencesData() {
    const result = []
    const cleanPreferencesResponse = await this.getPreferencesData()
    result.push(...extractAndTransformPreferencesFields(cleanPreferencesResponse))

    return result
  }
  async getPreferences() {
    return this.#preferences.get()
  }
  cleanPreferencesResponse(preferencesResponse) {
    delete preferencesResponse.apiVersion
    delete preferencesResponse.context
    delete preferencesResponse.errorCode
    delete preferencesResponse.statusCode
    delete preferencesResponse.statusReason
    delete preferencesResponse.time
    delete preferencesResponse.callId
    return preferencesResponse
  }
}
export default PreferencesImportFields
