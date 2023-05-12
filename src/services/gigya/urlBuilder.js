/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

class UrlBuilder {
  static buildUrl(namespace, dataCenter, endpoint) {
    const protocol = 'https'
    const domain = 'gigya.com'
    return `${protocol}://${namespace}.${dataCenter}.${domain}/${endpoint}`
  }
}

export default UrlBuilder
