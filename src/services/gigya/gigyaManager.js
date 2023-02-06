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
