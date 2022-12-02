import SiteConfigurator from '../configurator/siteConfigurator'

class GigyaManager {
  constructor(userKey, secret) {
    this.userKey = userKey
    this.secret = secret
  }

  async getDataCenterFromSite(site) {
    const siteConfigurator = new SiteConfigurator(this.userKey, this.secret, 'us1')
    const getConfigRes = await siteConfigurator.getSiteConfig(site)
    return getConfigRes.errorCode !== 0 ? '' : getConfigRes.dataCenter
  }
}

export default GigyaManager
