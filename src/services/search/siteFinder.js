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

  async #getPagedUserEffectiveSites(partnerInfo) {
    const url = UrlBuilder.buildUrl(SiteFinder.#NAMESPACE, SiteFinder.#DATA_CENTER_DEFAULT, 'admin.console.getPagedUserEffectiveSites')
    const bodyWithCredentials = {
      userKey: this.#credentials.userKey,
      secret: this.#credentials.secret,
      targetPartnerID: partnerInfo.PartnerID,
      pageSize: 1000,
      context: JSON.stringify({ partnerId: partnerInfo.PartnerID, partnerName: partnerInfo.Name }),
    }
    const response = await client.post(url, bodyWithCredentials).catch(function (error) {
      return generateErrorResponse(error, 'Error getting partner user effective sites')
    })
    return response.data
  }

  async getAllSites() {
    const partnersResponse = await this.#getPartners()
    if (partnersResponse.errorCode === 0) {
      return await this.#getPartnerSites(partnersResponse.partners)
    }
    return Promise.reject([partnersResponse])
  }

  async #getPartnerSites(partners) {
    const promises = []
    for (const partner of partners) {
      if (partner.errorCode === 0 && !partner.partner.IsCDP) {
        promises.push(this.#getPagedUserEffectiveSites(partner.partner))
      }
    }
    const responses = await Promise.all(promises)

    const sites = []
    for (const partnerSites of responses) {
      if (partnerSites.errorCode === 0) {
        this.#extractInfo(sites, partnerSites)
      } else {
        return Promise.reject([partnerSites])
      }
    }
    return sites
  }

  #extractInfo(sites, partnerSites) {
    for (const site of partnerSites.sites) {
      const context = JSON.parse(partnerSites.context)
      sites.push({
        apiKey: site.apiKey,
        baseDomain: site.name,
        dataCenter: site.datacenter,
        partnerId: context.partnerId,
        partnerName: context.partnerName,
      })
    }
  }
}

export default SiteFinder
