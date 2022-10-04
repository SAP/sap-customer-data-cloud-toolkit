'use strict'

const Site = require('./site')

class SiteManager {
	async create(siteHierarchy) {
		// site hierarchy cannot be empty
		// if (siteHierarchy.sites.length == 0) {
		// 	return {}
		// }
		this.siteService = new Site(
			siteHierarchy.partnerID,
			siteHierarchy.userKey,
			siteHierarchy.secret,
		)

		let responses = []
		try {
			for (let i = 0; i < siteHierarchy.sites.length; ++i) {
				responses = responses.concat(
					await this.createSiteHierarchy(siteHierarchy.sites[i]),
				)
			}
			return responses
		} catch (error) {}
	}

	async createSiteHierarchy(hierarchy) {
		let responses = []
		responses.push(await this.createParent(hierarchy))
		let childSites = hierarchy.childSites
		if (childSites && childSites.length > 0) {
			responses = responses.concat(
				await this.createChildren(hierarchy.childSites),
			)
		}
		return responses
	}

	async createParent(parentSite) {
		return await this.createSite(parentSite)
	}

	async createChildren(childSites) {
		let responses = []
		for (let i = 0; i < childSites.length; ++i) {
			responses.push(await this.createSite(childSites[i]))
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
}

module.exports = SiteManager
