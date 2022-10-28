import Site from './site'
import SiteConfigurator from './siteConfigurator'

class SiteManager {
  constructor(credentials) {
    this.credentials = credentials
    this.siteService = new Site(credentials.partnerId, credentials.userKey, credentials.secret)
  }

  async create(siteHierarchy) {
    // console.log(`Received request to create ${JSON.stringify(siteHierarchy)}`)

    let responses = []
    for (const site of siteHierarchy.sites) {
      responses = responses.concat(await this.#createSiteHierarchy(site))
      if (this.#isAnyResponseError(responses)) {
        await this.#rollbackCreatedSites(responses, site.dataCenter)
        break
      }
    }
    return responses
  }

  async #createSiteHierarchy(hierarchy) {
    let responses = []
    const response = await this.#createParent(hierarchy)
    responses.push(response)

    if (this.#isSuccessful(response)) {
      const childSites = hierarchy.childSites
      if (childSites && childSites.length > 0) {
        responses = responses.concat(await this.#createChildren(hierarchy.childSites, response.apiKey))
      }
    }
    return responses
  }

  async #createParent(parentSite) {
    return this.#createSite(parentSite)
  }

  async #createChildren(childSites, parentApiKey) {
    const responses = []
    for (const site of childSites) {
      const childResponse = await this.#createSiteAndConnect(site, parentApiKey)
      responses.push(childResponse)
      if (!this.#isSuccessful(childResponse)) {
        break
      }
    }
    return responses
  }

  async #createSiteAndConnect(site, parentApiKey) {
    const siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, site.dataCenter)
    let childResponse = await this.#createSite(site)
    if (this.#isSuccessful(childResponse)) {
      const scResponse = await siteConfigurator.connect(parentApiKey, childResponse.apiKey)
      if (!this.#isSuccessful(scResponse)) {
        childResponse = this.#mergeErrorResponse(childResponse, scResponse)
      }
    }
    return childResponse
  }

  async #createSite(site) {
    const body = {
      baseDomain: site.baseDomain,
      description: site.description,
      dataCenter: site.dataCenter,
    }
    // console.log(`Creating site ${site.baseDomain}`)
    const response = await this.siteService.create(body)
    // console.log('createSite.response=' + JSON.stringify(response))
    return this.#enrichResponse(response, site.tempId)
  }

  #enrichResponse(response, id) {
    const resp = Object.assign({}, response)
    resp.tempId = id
    resp.deleted = false
    resp.endpoint = Site.getCreateEndpoint()
    return resp
  }

  #isSuccessful(response) {
    return response.errorCode === 0
  }

  #shouldBeRollbacked(response) {
    return response.errorCode === 0 || (response.errorCode !== 0 && response.tempId && response.apiKey && response.apiKey.length > 0)
  }

  async deleteSites(targetApiKeys) {
    const responses = []
    const siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, undefined)

    for (const site of targetApiKeys) {
      const siteConfig = await siteConfigurator.getSiteConfig(site)
      if (this.#isSiteAlreadyDeleted(siteConfig)) {
        continue
      }

      if (!this.#isSuccessful(siteConfig)) {
        responses.push(siteConfig)
        continue
      }

      const dataCenter = siteConfig.dataCenter
      const siteMembers = siteConfig.siteGroupConfig.members

      // Delete site members
      if (siteMembers.length > 0) {
        const memberResponses = await this.#siteMembersDeleter(siteMembers, dataCenter)
        responses.push(...memberResponses)
      }

      // Delete parent site
      const response = await this.siteService.delete(site, dataCenter)
      responses.push(response)
    }
    return responses
  }

  async #siteMembersDeleter(siteMembers, dataCenter) {
    const responses = []
    for (const site of siteMembers) {
      const response = await this.siteService.delete(site, dataCenter)
      responses.push(response)
    }
    return responses
  }

  #isSiteAlreadyDeleted(res) {
    return res.errorDetails === 'Site was deleted' && res.statusCode === 403
  }

  #mergeErrorResponse(siteResponse, siteConfiguratorResponse) {
    const response = Object.assign({}, siteResponse)
    response.statusCode = siteConfiguratorResponse.statusCode
    response.statusReason = siteConfiguratorResponse.statusReason
    response.errorCode = siteConfiguratorResponse.errorCode
    response.errorMessage = siteConfiguratorResponse.errorMessage
    response.errorDetails = siteConfiguratorResponse.errorDetails
    response.time = siteConfiguratorResponse.time
    response.endpoint = SiteConfigurator.getSetEndpoint()
    return response
  }

  #isAnyResponseError(responses) {
    for (const response of responses) {
      if (!this.#isSuccessful(response)) {
        return true
      }
    }
    return false
  }

  async #rollbackCreatedSites(responses, dataCenter) {
    const apiKeys = this.#getApiKeysCreatedInReverseOrder(responses)
    for (let i = 0; i < apiKeys.length; ++i) {
      const response = await this.siteService.delete(apiKeys[i], dataCenter)
      if (this.#isSuccessful(response)) {
        responses[i].deleted = true
      }
    }
  }

  #getApiKeysCreatedInReverseOrder(responses) {
    const apiKeysCreated = []
    for (let i = responses.length - 1; i >= 0; --i) {
      if (this.#shouldBeRollbacked(responses[i])) {
        apiKeysCreated.push(responses[i].apiKey)
      }
    }
    return apiKeysCreated
  }
}

export default SiteManager
