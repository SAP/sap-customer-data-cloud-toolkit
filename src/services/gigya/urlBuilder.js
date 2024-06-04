/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import dataCenters from '../../redux/dataCenters/dataCenters.json'

class UrlBuilder {
  static buildUrl(namespace, dataCenter, endpoint, gigyaConsole) {
    const console = this.#getConsole(gigyaConsole)
    const dc = dataCenter ? dataCenter : this.#getPrimaryDataCenter(console)
    const protocol = 'https'
    const domain = this.#getDomain(console)
    return `${protocol}://${namespace}.${dc}.${domain}/${endpoint}`
  }

  static #getConsole(gigyaConsole) {
    return gigyaConsole ? gigyaConsole : dataCenters.filter((dataCenter) => dataCenter.isDefault === true)[0].console
  }

  static #getPrimaryDataCenter(console) {
    const hostDataCenters = dataCenters.filter((dataCenter) => {
      return new RegExp(dataCenter.console).test(console)
    })[0].datacenters

    return hostDataCenters.filter((dataCenter) => dataCenter.isPrimary === true)[0].value
  }

  static #getDomain(host) {
    return host.includes('cn1') ? 'sapcdm.cn' : 'gigya.com'
  }
}

export default UrlBuilder
