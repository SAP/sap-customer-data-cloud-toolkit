import UrlBuilder from '../gigya/urlBuilder'
import client from '../gigya/client'
import generateErrorResponse from '../errors/generateErrorResponse'

class SiteFinder {
  static #NAMESPACE = 'admin'
  static #DATA_CENTER_DEFAULT = 'us1'
  #credentials

  constructor(credentials) {
    this.#credentials = credentials
  }

  async #getPartners() {
    const url = UrlBuilder.buildUrl(SiteFinder.#NAMESPACE, SiteFinder.#DATA_CENTER_DEFAULT, 'admin.console.getPartners')
    const bodyWithCredentials = { userKey: this.#credentials.userKey, secret: this.#credentials.secret }
    const response = await client.post(url, bodyWithCredentials).catch(function (error) {
      return generateErrorResponse(error, 'Error getting partners')
    })
    return response.data
  }

  async #getPagedUserEffectiveSites(partnerId) {
    const url = UrlBuilder.buildUrl(SiteFinder.#NAMESPACE, SiteFinder.#DATA_CENTER_DEFAULT, 'admin.console.getPagedUserEffectiveSites')
    const bodyWithCredentials = { userKey: this.#credentials.userKey, secret: this.#credentials.secret, targetPartnerID: partnerId, pageSize: 1000, context: partnerId }
    const response = await client.post(url, bodyWithCredentials).catch(function (error) {
      return generateErrorResponse(error, 'Error getting partner user effective sites')
    })
    return response.data
  }

  async getAllSites() {
    const promises = []
    const partnersResponse = await this.#getPartners()
    if (partnersResponse.errorCode === 0) {
      for (const partner of partnersResponse.partners) {
        promises.push(this.#getPagedUserEffectiveSites(partner.partner.PartnerID))
      }
      const responses = await Promise.all(promises)

      const sites = []
      for (const partnerSites of responses) {
        if (partnerSites.errorCode === 0) {
          for (const site of partnerSites.sites) {
            sites.push({ apiKey: site.apiKey, baseDomain: site.name, dataCenter: site.datacenter, partnerId: partnerSites.context })
          }
        } else {
          return Promise.reject([partnerSites])
        }
      }
      return sites
    }
    return Promise.reject([partnersResponse])
  }
}

export default SiteFinder
