'use strict'

const Site = require('./site')
const SiteConfigurator = require('./siteConfigurator')

class SiteManager {
  constructor(credentials) {
    this.credentials = credentials
  }

  async create(siteHierarchy) {
    console.log(`Received request to create ${JSON.stringify(siteHierarchy)}`)
    // site hierarchy cannot be empty
    // if (siteHierarchy.sites.length == 0) {
    // 	return {}
    // }
    this.siteService = new Site(this.credentials.partnerID, this.credentials.userKey, this.credentials.secret)
    this.siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, siteHierarchy.sites[0].dataCenter)

    let responses = []
    let error = false
    for (const site of siteHierarchy.sites) {
      responses = responses.concat(await this.createSiteHierarchy(site))
      if (this.isAnyResponseError(responses)) {
        error = true
        break
      }
    }
    if (error) {
      this.rollbackCreatedSites(responses)
    }
    return responses
  }

  async createSiteHierarchy(hierarchy) {
    let responses = []
    const response = await this.createParent(hierarchy)
    responses.push(response)

    if (this.isSuccessful(response)) {
      const childSites = hierarchy.childSites
      if (childSites && childSites.length > 0) {
        responses = responses.concat(await this.createChildren(hierarchy.childSites, response.apiKey))
      }
    }
    return responses
  }

  async createParent(parentSite) {
    return this.createSite(parentSite)
  }

  async createChildren(childSites, parentApiKey) {
    const responses = []
    for (const site of childSites) {
      let childResponse = await this.createSite(site)
      childResponse.endpoint = Site.getEndpoint()
      if (this.isSuccessful(childResponse)) {
        const scResponse = await this.connectSite(parentApiKey, childResponse.apiKey)
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
    const body = {
      baseDomain: site.baseDomain,
      description: site.description,
      dataCenter: site.dataCenter,
    }
    console.log(`Creating site ${site.baseDomain}`)
    const response = await this.siteService.create(body)
    console.log('createSite.response=' + JSON.stringify(response))
    return this.enrichResponse(response, site.tempId)
  }

  enrichResponse(response, id) {
    const resp = Object.assign({}, response)
    resp.siteUiId = id
    resp.deleted = false
    return resp
  }

  isSuccessful(response) {
    return response.errorCode === 0
  }

  shouldBeRollbacked(response) {
    return response.errorCode === 0 || (response.errorCode !== 0 && response.siteUiId && response.apiKey && response.apiKey.length > 0)
  }

  async connectSite(parentApiKey, childApiKey) {
    return this.siteConfigurator.connect(parentApiKey, childApiKey)
  }

  mergeErrorResponse(siteResponse, siteConfiguratorResponse) {
    const response = Object.assign({}, siteResponse)
    response.statusCode = siteConfiguratorResponse.statusCode
    response.statusReason = siteConfiguratorResponse.statusReason
    response.errorCode = siteConfiguratorResponse.errorCode
    response.errorMessage = siteConfiguratorResponse.errorMessage
    response.errorDetails = siteConfiguratorResponse.errorDetails
    response.time = siteConfiguratorResponse.time
    return response
  }

  isAnyResponseError(responses) {
    for (const response of responses) {
      if (!this.isSuccessful(response)) {
        return true
      }
    }
    return false
  }

  rollbackCreatedSites(responses) {
    const apiKeys = this.getApiKeysCreatedInReverseOrder(responses)
    for (let i = 0; i < apiKeys.length; ++i) {
      const response = this.siteService.delete(apiKeys[i])
      if (this.isSuccessful(response)) {
        responses[i].deleted = true
      }
    }
  }

  getApiKeysCreatedInReverseOrder(responses) {
    const apiKeysCreated = []
    for (let i = responses.length - 1; i >= 0; --i) {
      if (this.shouldBeRollbacked(responses[i])) {
        apiKeysCreated.push(responses[i].apiKey)
      }
    }
    return apiKeysCreated
  }
}

module.exports = SiteManager
