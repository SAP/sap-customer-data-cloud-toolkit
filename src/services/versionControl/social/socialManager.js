/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Social from '../../copyConfig/social/social.js'
import { stringToJson } from '../../copyConfig/objectHelper.js'

class SocialManager {
  static #NAMESPACE = 'socialize'
  static #GET_ENDPOINT = 'socialize.getProvidersConfig'
  static #SET_ENDPOINT = 'socialize.setProvidersConfig'
  static #ERROR_GET_SOCIAL_CONFIG = 'Error retrieving social configuration'
  static #ERROR_SET_SOCIAL_CONFIG = 'Error setting social configuration'
  #credentials

  constructor(credentials, apiKey, dataCenter) {
    this.#credentials = credentials
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
    this.social = new Social(credentials, apiKey, dataCenter)
  }

  async setFromFiles(apiKey, dataCenter, config) {
    try {
      const response = await this.social.set(apiKey, config, dataCenter)
      if (response.context) {
        response['context'] = response.context.replace(/&quot;/g, '"')
        stringToJson(response, 'context')
      }
      return response
    } catch (error) {
      console.error('Error setting social config from Git:', error)
      throw error
    }
  }
}

export default SocialManager
