import SiteConfigurator from '../configurator/siteConfigurator'

class GigyaManager {
  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
  }

  async getDataCenterFromSite(site) {
    const siteConfigurator = new SiteConfigurator(this.userKey, this.secret, 'us1')
    return await siteConfigurator.getSiteConfig(site)
  }
}

export default GigyaManager
