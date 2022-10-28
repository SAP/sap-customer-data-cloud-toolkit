import Site from './site'
import SiteConfigurator from './siteConfigurator'

class SiteManagerAsync {
  constructor(credentials) {
    this.credentials = credentials
    this.siteService = new Site(credentials.partnerID, credentials.userKey, credentials.secret)
  }

  create(siteHierarchy) {
    console.log(`Received request to create ${JSON.stringify(siteHierarchy)}`)

    let promises = []
    //let responses = []
    for (let i = 0; i < siteHierarchy.sites.length; ++i) {
      const site = siteHierarchy.sites[i]
      promises[i] = this.#createSiteHierarchy(site)
    }
    return Promise.all(promises)
      .then((siteHierarchyCreatedResponses) => {
        console.log(`SiteManagerAsync.create then ${JSON.stringify(siteHierarchyCreatedResponses)}`)
        if (this.#isAnyResponseError(siteHierarchyCreatedResponses)) {
          console.log(`SiteManagerAsync.before rollbackHierarchies ${JSON.stringify(siteHierarchyCreatedResponses)}`)
          return this.#rollbackHierarchies(siteHierarchyCreatedResponses)
        }
        return siteHierarchyCreatedResponses
      })
      .then((rollbackHierarchiesResponses) => {
        console.log(`SiteManagerAsync.after rollbackHierarchies ${JSON.stringify(rollbackHierarchiesResponses)}`)
        // nothing to do, just making sure that rollback was finished
        return rollbackHierarchiesResponses
      })
      .catch((error) => {
        console.log(`SiteManagerAsync.create catch ${error}`)
        return error
      })
  }

  async #createSiteHierarchy(hierarchy) {
    let responses = []
    let response = await this.#createParent(hierarchy)
    response = this.#enrichResponse(response.data, hierarchy.tempId)
    this.#addIsChildSiteToResponse(response, false)
    responses.push(response)
    let promises = []

    if (this.#isSuccessful(response)) {
      const childSites = hierarchy.childSites
      if (childSites && childSites.length > 0) {
        promises = this.#createChildren(hierarchy.childSites, response.apiKey)
        return Promise.all(promises)
          .then((childrenCreatedResponses) => {
            console.log(`SiteManagerAsync.createSiteHierarchy then ${JSON.stringify(childrenCreatedResponses)}`)
            responses.push(...childrenCreatedResponses)
            console.log(`SiteManagerAsync.createSiteHierarchy2 then ${JSON.stringify(responses)}`)
            return responses
          })
          .catch((error) => {
            console.log(`SiteManagerAsync.create catch ${error}`)
            return error
          })
      }
    }
    console.log(`SiteManagerAsync.createSiteHierarchy3 ${JSON.stringify(responses)}`)
    return promises.length === 0 ? Promise.resolve(responses) : Promise.all(response, ...promises)
  }

  async #createParent(parentSite) {
    return this.#createSite(parentSite)
  }

  #createChildren(childSites, parentApiKey) {
    const promises = []
    for (const site of childSites) {
      promises.push(this.#createSiteAndConnect(site, parentApiKey))
    }
    return promises
  }

  async #createSiteAndConnect(site, parentApiKey) {
    const siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, site.dataCenter)
    let childResponse = (await this.#createSite(site)).data
    childResponse = this.#enrichResponse(childResponse, site.tempId)
    this.#addIsChildSiteToResponse(childResponse, true)
    console.log(`SiteManagerAsync.createSiteAndConnect siteCreated ${JSON.stringify(childResponse)}`)
    if (this.#isSuccessful(childResponse)) {
      const scResponse = (await siteConfigurator.connectAsync(parentApiKey, childResponse.apiKey)).data
      console.log(`SiteManagerAsync.createSiteAndConnect connectAsync ${JSON.stringify(scResponse)}`)
      if (!this.#isSuccessful(scResponse)) {
        childResponse = this.#mergeErrorResponse(childResponse, scResponse)
        console.log(`SiteManagerAsync.createSiteAndConnect merged ${JSON.stringify(childResponse)}`)
      }
    }
    return childResponse
  }

  #createSite(site) {
    const body = {
      baseDomain: site.baseDomain,
      description: site.description,
      dataCenter: site.dataCenter,
    }
    console.log(`Creating site ${site.baseDomain}`)
    return this.siteService.createAsync(body)
  }

  #enrichResponse(response, id) {
    const resp = Object.assign({}, response)
    resp.tempId = id
    resp.deleted = false
    resp.endpoint = Site.getCreateEndpoint()
    return resp
  }

  // The function addApiKeyToResponse is used to set the apiKey in the response.
  // It will allow to map the responses to the requests performed in parallel, used in the rollback feature
  #addApiKeyToResponse(response, apiKey) {
    response.apiKey = apiKey
  }

  // The function addIsChildSiteToResponse is used to set in the response if it belongs to a parent or child site.
  // It will be useful to speed up the sites rollback, passing only the parent apiKey to deleteSites method
  #addIsChildSiteToResponse(response, isChild) {
    response.isChildSite = isChild
  }

  #isSuccessful(response) {
    return response.errorCode === 0
  }

  #shouldBeRollbacked(response) {
    return response.errorCode === 0 || (response.errorCode !== 0 && response.tempId && response.apiKey && response.apiKey.length > 0)
  }

  async deleteSites(targetApiKeys) {
    const responses = []
    for (const site of targetApiKeys) {
      responses.push(this.#deleteSite(site))
    }
    return Promise.all(responses.flat())
      .then((deleteResponses) => {
        console.log(`SiteManagerAsync.deleteSites then ${deleteResponses}`)
        return deleteResponses.flat()
      })
      .catch((error) => {
        console.log(`SiteManagerAsync.deleteSites catch ${error}`)
        return error
      })
  }

  async #deleteSite(targetApiKey) {
    console.log(`SiteManagerAsync.#deleteSite Deleting ${targetApiKey}`)
    const responses = []
    const siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, undefined)

    let siteConfig = await siteConfigurator.getSiteConfig(targetApiKey)
    console.log(`SiteManagerAsync.#deleteSite siteConfig response ${JSON.stringify(siteConfig)}`)
    if (this.#isSiteAlreadyDeleted(siteConfig) || !this.#isSuccessful(siteConfig)) {
      this.#addApiKeyToResponse(siteConfig, targetApiKey)
      responses.push(siteConfig)
      return Promise.resolve(responses)
    }

    const dataCenter = siteConfig.dataCenter
    const siteMembers = siteConfig.siteGroupConfig.members

    // Delete site members
    if (siteMembers.length > 0) {
      console.log(`ApiKey ${targetApiKey} contains ${siteMembers.length} site members`)
      const memberResponses = await this.#siteMembersDeleter(siteMembers, dataCenter)
      console.log(`SiteManagerAsync.#deleteSite siteMembersDeleter response ${JSON.stringify(memberResponses)}`)
      responses.push(...memberResponses.flat())
    }

    // Delete parent site
    const response = await this.siteService.delete(targetApiKey, dataCenter)
    console.log(`SiteManagerAsync.#deleteSite parent response ${JSON.stringify(response)}`)
    this.#addApiKeyToResponse(response, targetApiKey)
    responses.push(response)
    console.log(`SiteManagerAsync.#deleteSite all responses ${JSON.stringify(responses)}`)
    return responses
  }

  async #siteMembersDeleter(siteMembers, dataCenter) {
    const promises = []
    for (let i = 0; i < siteMembers.length; ++i) {
      const site = siteMembers[i]
      promises[i] = this.#deleteSiteMember(site, dataCenter)
    }
    const responses = []
    return Promise.all(promises).then((response) => {
      console.log(`SiteManagerAsync.#siteMembersDeleter ${JSON.stringify(response)}`)
      responses.push(response)
      return responses
    })
  }

  async #deleteSiteMember(site, dataCenter) {
    const response = await this.siteService.delete(site, dataCenter)
    console.log(`SiteManagerAsync.#deleteSiteMember delete ${JSON.stringify(response)}`)
    this.#addApiKeyToResponse(response, site)
    return response
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

  #isAnyResponseError(responsesArray) {
    for (const responses of responsesArray) {
      for (const response of responses) {
        if (!this.#isSuccessful(response)) {
          return true
        }
      }
    }
    return false
  }

  async #rollbackHierarchies(hierarchiesResponses) {
    let promises = []
    for (let i = 0; i < hierarchiesResponses.length; ++i) {
      promises[i] = this.#rollbackCreatedSites(hierarchiesResponses[i])
    }
    return Promise.all(promises)
      .then((responses) => {
        console.log(`SiteManagerAsync.rollbackHierarchies then ${JSON.stringify(responses)}`)
        return responses
      })
      .catch((error) => {
        console.log(`SiteManagerAsync.rollbackHierarchies catch ${error}`)
        return error
      })
  }

  async #rollbackCreatedSites(responses) {
    console.log(`SiteManagerAsync.rollbackCreatedSites ${JSON.stringify(responses)}`)
    const parentSiteResponse = responses.find((response) => {
      return response.isChildSite === false
    })
    if (this.#shouldBeRollbacked(parentSiteResponse)) {
      const deleteResponses = await this.deleteSites([parentSiteResponse.apiKey])
      console.log(`SiteManagerAsync.rollbackCreatedSites deleted responses ${JSON.stringify(deleteResponses)}`)
      for (const response of deleteResponses.flat()) {
        if (this.#isSuccessful(response)) {
          this.#findSiteInResponsesAndMarkItAsDeleted(responses, response.apiKey)
        }
      }
    }
    return responses
  }

  #findSiteInResponsesAndMarkItAsDeleted(responses, apiKey) {
    console.log(`SiteManagerAsync.findSiteInResponsesAndMarkItAsDeleted responses ${JSON.stringify(responses)}`)
    const response = responses.find((response) => {
      return response.apiKey === apiKey && response.deleted === false
    })
    console.log(`SiteManagerAsync.findSiteInResponsesAndMarkItAsDeleted response ${JSON.stringify(response)}`)
    if (response) {
      response.deleted = true
    }
  }
}

export default SiteManagerAsync
