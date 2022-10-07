'use strict'

const Site = require('./site')
const SiteConfigurator = require('./siteConfigurator')

class SiteManager {
  constructor(credentials) {
    this.credentials = credentials
  }

  async create(siteHierarchy) {
    // site hierarchy cannot be empty
    // if (siteHierarchy.sites.length == 0) {
    // 	return {}
    // }
    this.siteService = new Site(this.credentials.partnerID, this.credentials.userKey, this.credentials.secret)
    this.siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, siteHierarchy.sites[0].dataCenter)

    let responses = []
    for (let i = 0; i < siteHierarchy.sites.length; ++i) {
      responses = responses.concat(await this.createSiteHierarchy(siteHierarchy.sites[i]))
    }
    if (this.isAnyResponseError(responses)) {
      this.rollbackCreatedSites(responses)
    }
    return responses
  }

  async createSiteHierarchy(hierarchy) {
    let responses = []
    let response = await this.createParent(hierarchy)
    responses.push(response)

    if (this.isSuccessful(response)) {
      let childSites = hierarchy.childSites
      if (childSites && childSites.length > 0) {
        responses = responses.concat(await this.createChildren(hierarchy.childSites, response.apiKey))
      }
    }
    return responses
  }

  async createParent(parentSite) {
    return await this.createSite(parentSite)
  }

  async createChildren(childSites, parentApiKey) {
    let responses = []
    for (let i = 0; i < childSites.length; ++i) {
      let childResponse = await this.createSite(childSites[i])
      if (this.isSuccessful(childResponse)) {
        let scResponse = await this.connectSite(parentApiKey, childResponse.apiKey)
        if (!this.isSuccessful(scResponse)) {
          childResponse = this.mergeErrorResponse(childResponse, scResponse)
        }
      }
      responses.push(childResponse)
      if (!this.isSuccessful(childResponse)) {
        break
      }
    }
    return responses
  }

  async createSite(site) {
    let response = await this.siteService.create(site)
    console.log('createSite.response=' + JSON.stringify(response))
    return this.enrichResponse(response, site.id)
  }

  enrichResponse(response, id) {
    let resp = Object.assign({}, response)
    resp.siteUiId = id
    resp.deleted = false
    return resp
  }

  isSuccessful(response) {
    return response.errorCode === 0
    //return response.errorCode === 0 || (response.errorCode !== 0 && response.siteUiId && response.apiKey && response.apiKey.length > 0)
  }

  shouldBeRollbacked(response) {
    return response.errorCode === 0 || (response.errorCode !== 0 && response.siteUiId && response.apiKey && response.apiKey.length > 0)
  }

  async connectSite(parentApiKey, childApiKey) {
    return await this.siteConfigurator.connect(parentApiKey, childApiKey)
  }

  mergeErrorResponse(siteResponse, siteConfiguratorResponse) {
    let response = Object.assign({}, siteResponse)
    response.statusCode = siteConfiguratorResponse.statusCode
    response.statusReason = siteConfiguratorResponse.statusReason
    response.errorCode = siteConfiguratorResponse.errorCode
    response.errorMessage = siteConfiguratorResponse.errorMessage
    response.errorDetails = siteConfiguratorResponse.errorDetails
    response.time = siteConfiguratorResponse.time
    return response
  }

  isAnyResponseError(responses) {
    for (let i = 0; i < responses.length; ++i) {
      if (!this.isSuccessful(responses[i])) {
        return true
      }
    }
    return false
  }

  rollbackCreatedSites(responses) {
    let apiKeys = this.getApiKeysCreatedInReverseOrder(responses)
    for (let i = 0; i < apiKeys.length; ++i) {
      let response = this.siteService.delete(apiKeys[i])
      if (this.isSuccessful(response)) {
        responses[i].deleted = true
      }
    }
  }

  getApiKeysCreatedInReverseOrder(responses) {
    let apiKeysCreated = []
    for (let i = responses.length - 1; i >= 0; --i) {
      if (this.shouldBeRollbacked(responses[i])) {
        apiKeysCreated.push(responses[i].apiKey)
      }
    }
    return apiKeysCreated
  }
}

module.exports = SiteManager
