/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import SiteConfigurator from '../configurator/siteConfigurator'
import Sorter from './sorter'

class ParentChildSorter extends Sorter {
  #siteConfigurator

  constructor(credentials) {
    super()
    this.#siteConfigurator = new SiteConfigurator(credentials.userKey, credentials.secret)
  }

  async sort(arrayOfValues) {
    const parentArray = []
    const childArray = []
    for (const apiKey of arrayOfValues) {
      const siteInfo = await this.#getSiteInformation(apiKey)
      const apiKeyIsChild = this.#isChildSite(siteInfo, apiKey)
      apiKeyIsChild ? childArray.push(apiKey) : parentArray.push(apiKey)
    }
    return [parentArray, childArray]
  }

  async #getSiteInformation(apiKey) {
    const response = await this.#siteConfigurator.getSiteConfig(apiKey, 'us1')
    return response.errorCode === 0 ? Promise.resolve(response) : Promise.reject(response)
  }

  #isChildSite(siteInfo, siteApiKey) {
    return siteInfo.siteGroupOwner !== undefined && siteInfo.siteGroupOwner !== siteApiKey
  }
}

export default ParentChildSorter
