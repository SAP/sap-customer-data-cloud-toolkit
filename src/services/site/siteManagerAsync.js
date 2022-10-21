import Site from './site'
import SiteConfigurator from './siteConfigurator'

class SiteManagerAsync {
  constructor(credentials) {
    this.credentials = credentials
    this.siteService = new Site(credentials.partnerID, credentials.userKey, credentials.secret)
  }

  // async create(siteHierarchy) {
  //   console.log(`Received request to create ${JSON.stringify(siteHierarchy)}`)

  //   let responses = []
  //   for (const site of siteHierarchy.sites) {
  //     responses = responses.concat(await this.#createSiteHierarchy(site))
  //     if (this.#isAnyResponseError(responses)) {
  //       await this.#rollbackCreatedSites(responses, site.dataCenter)
  //       break
  //     }
  //   }
  //   return responses
  // }

  create(siteHierarchy) {
    console.log(`Received request to create ${JSON.stringify(siteHierarchy)}`)

    let promises = []
    let responses = []
    for (let i = 0; i < siteHierarchy.sites.length; ++i) {
      const site = siteHierarchy.sites[i]
      promises[i] = this.#createSiteHierarchy(site)
    }
    return (
      Promise.all(promises)
        .then((values) => {
          console.log(`SiteManagerAsync.create then ${JSON.stringify(values)}`)
          // responses.push(values.data)
          // console.log(`SiteManagerAsync.create2 then ${JSON.stringify(responses)}`)
          // console.log(`size2=${responses.length}`)
          // return responses
          return values
        })
        .then(async (responses) => {
          if (this.#isAnyResponseError(responses[0])) {
            //await this.#rollbackCreatedSites(responses, site.dataCenter)
            console.log(`SiteManagerAsync.before rollbackCreatedSites ${JSON.stringify(responses[0])}`)
            await this.#rollbackCreatedSites(responses[0], 'us1')
            console.log(`SiteManagerAsync.after rollbackCreatedSites ${JSON.stringify(responses[0])}`)
          }
          return responses
        })
        // .then((values) => {
        //   // nothing to do, just making sure that rollback was finished
        //   return values
        // })
        .catch((values) => {
          console.log(`SiteManagerAsync.create catch ${JSON.stringify(values)}`)
          //responses.push(values)
          return values
        })
    )
  }

  async #createSiteHierarchy(hierarchy) {
    let responses = []
    let response = await this.#createParent(hierarchy)
    response = this.#enrichResponse(response.data, hierarchy.tempId)
    responses.push(response)
    let promises = []

    if (this.#isSuccessful(response)) {
      const childSites = hierarchy.childSites
      if (childSites && childSites.length > 0) {
        //responses = responses.concat(await this.#createChildren(hierarchy.childSites, response.apiKey))
        promises = this.#createChildren(hierarchy.childSites, response.apiKey)
        return Promise.all(promises)
          .then((values) => {
            console.log(`SiteManagerAsync.createSiteHierarchy then ${JSON.stringify(values)}`)
            responses.push(...values)
            console.log(`SiteManagerAsync.createSiteHierarchy2 then ${JSON.stringify(responses)}`)
            return responses
          })
          .catch((values) => {
            console.log(`SiteManagerAsync.create catch ${JSON.stringify(values)}`)
          })
      }
    }
    console.log(`SiteManagerAsync.createSiteHierarchy3 ${JSON.stringify(responses)}`)
    console.log(`SiteManagerAsync.createSiteHierarchy4 ${promises.length}`)
    return promises.length === 0 ? Promise.resolve(responses) : Promise.all(response, ...promises)
  }

  // async #createSiteHierarchy(hierarchy) {
  //   let responses = []
  //   return this.#createParent(hierarchy).then((response) => {
  //     console.log(`SiteManagerAsync.createSiteHierarchy then ${JSON.stringify(response)}`)
  //     const responseData = this.#enrichResponse(response.data, hierarchy.tempId)
  //     responses.push(responseData)
  //     if (this.#isSuccessful(responseData)) {
  //       const childSites = hierarchy.childSites
  //       if (childSites && childSites.length > 0) {
  //         return this.#createChildren(hierarchy.childSites, responseData.apiKey).then((response) => {
  //           console.log(`SiteManagerAsync.createChildren then ${JSON.stringify(response)}`)
  //           return responses.concat(response.data)
  //         })
  //       }
  //     }
  //     console.log(`SiteManagerAsync.createSiteHierarchy2 then ${JSON.stringify(responses)}`)
  //     return responses
  //   })
  //}

  async #createParent(parentSite) {
    return this.#createSite(parentSite)
  }

  #createChildren(childSites, parentApiKey) {
    const promises = []
    for (const site of childSites) {
      promises.push(this.#createSiteAndConnect(site, parentApiKey))
      // responses.push(childResponse)
      // if (!this.#isSuccessful(childResponse)) {
      //   break
      // }
    }
    return promises
  }

  async #createSiteAndConnect(site, parentApiKey) {
    const siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, site.dataCenter)
    let childResponse = (await this.#createSite(site)).data
    childResponse = this.#enrichResponse(childResponse, site.tempId)
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

  // #createChildren(childSites, parentApiKey) {
  //   console.log(`Creating children ${JSON.stringify(childSites)} for parentApiKey=${parentApiKey}`)
  //   const siteConfigurator = new SiteConfigurator(this.credentials.userKey, this.credentials.secret, childSites[0].dataCenter)
  //   const responses = []
  //   let promises = []
  //   for (let i = 0; i < childSites.length; ++i) {
  //     const site = childSites[i]
  //     promises[i] = this.#createSite(site)
  //       .then((childResponse) => {
  //         console.log(`SiteManagerAsync.createSite then ${JSON.stringify(childResponse)}`)
  //         //console.log('createSite.response=' + JSON.stringify(childResponse))
  //         const childResponseData = this.#enrichResponse(childResponse.data, site.tempId)
  //         if (this.#isSuccessful(childResponseData)) {
  //           return Promise.all([siteConfigurator.connectAsync(parentApiKey, childResponseData.apiKey), childResponseData])
  //         }
  //       })
  //       .then((value) => {
  //         console.log(`SiteManagerAsync.connectAsync then ${JSON.stringify(value)}`)
  //         const scResponse = value[0].data
  //         let childResponseData = value[1]
  //         // console.log(`SiteManagerAsync.connectAsync1 then ${JSON.stringify(scResponse)}`)
  //         // console.log(`SiteManagerAsync.connectAsync2 then ${JSON.stringify(childResponseData)}`)
  //         if (!this.#isSuccessful(scResponse)) {
  //           childResponseData = this.#mergeErrorResponse(childResponseData, scResponse)
  //           //responses.push(childResponseData)
  //         }
  //         return childResponseData
  //       })

  //     // let childResponse = await this.#createSite(site)
  //     // if (this.#isSuccessful(childResponse)) {
  //     //   const scResponse = await siteConfigurator.connectAsync(parentApiKey, childResponse.apiKey)
  //     //   if (!this.#isSuccessful(scResponse.data)) {
  //     //     childResponse = this.#mergeErrorResponse(childResponse, scResponse.data)
  //     //   }
  //     // }
  //     // responses.push(childResponse)
  //     // if (!this.#isSuccessful(childResponse)) {
  //     //   break
  //     // }
  //   }
  //   return Promise.all(promises).then((values) => {
  //     console.log(`SiteManagerAsync.createChildren all ${JSON.stringify(values)}`)
  //     //responses.push(values)
  //     return values
  //   })
  //   //return responses
  // }

  #createSite(site) {
    const body = {
      baseDomain: site.baseDomain,
      description: site.description,
      dataCenter: site.dataCenter,
    }
    console.log(`Creating site ${site.baseDomain}`)
    return this.siteService.createAsync(body)
    //const response = await this.siteService.createAsync(body)
    // console.log('createSite.response=' + JSON.stringify(response))
    // return this.#enrichResponse(response.data, site.tempId)
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

export default SiteManagerAsync
