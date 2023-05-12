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

class GigyaManager {
  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
  }

  async getDataCenterFromSite(site) {
    const siteConfigurator = new SiteConfigurator(this.userKey, this.secret)
    return await siteConfigurator.getSiteConfig(site, 'us1')
  }
}

export default GigyaManager
