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
    return responses
  }

  async createSiteHierarchy(hierarchy) {
    let responses = []
    let response = await this.createParent(hierarchy)
    responses.push(response)

    let childSites = hierarchy.childSites
    if (childSites && childSites.length > 0) {
      responses = responses.concat(await this.createChildren(hierarchy.childSites, response.apiKey))
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
        let csResponse = await this.connectSite(parentApiKey, childResponse.apiKey)
        this.isSuccessful(csResponse) ? responses.push(childResponse) : responses.push(csResponse)
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
    return response.statusCode == 200
  }

  async connectSite(parentApiKey, childApiKey) {
    return await this.siteConfigurator.connect(parentApiKey, childApiKey)
  }
}

module.exports = SiteManager
