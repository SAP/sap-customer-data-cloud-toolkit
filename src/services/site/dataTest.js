/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import * as CommonTestData from '../servicesDataTest.js'

const Endpoints = {
  SITE_CREATE: 'admin.createSite',
  SITE_CONFIG: 'admin.setSiteConfig',
}

const parent1SiteId = 'idP1'
const parent2SiteId = 'idP2'
const child1SiteId = 'C1'
const child2SiteId = 'C2'
const apiKey = 'apiKey'
const DOMAIN_PREFIX = 'cdc.'

const expectedGigyaResponseOk = Object.assign({ apiKey: apiKey }, CommonTestData.expectedGigyaResponseOk)

const expectedGigyaResponseNoSecret = {
  errorMessage: 'Permission denied',
  errorDetails: 'Invalid namespace &#39;admin&#39; or method &#39;createSite&#39; or you do not have the required permissions to call it. ',
  statusCode: 403,
  errorCode: 403007,
  statusReason: 'Forbidden',
  callId: 'ed5c54bfe321478b8db4298c2539265a',
  apiVersion: 2,
  time: Date.now(),
}

const expectedGigyaResponseNoUserKey = expectedGigyaResponseNoSecret

const expectedGigyaResponseNoPartnerId = {
  callId: '719a94d3fecc4159a748345c757a49a3',
  errorCode: 400002,
  errorDetails: 'Missing required parameter : partnerID',
  errorMessage: 'Missing required parameter',
  statusCode: 400,
  statusReason: CommonTestData.badRequest,
  apiVersion: 2,
  time: Date.now(),
}

const expectedGigyaResponseNoBaseDomain = {
  callId: '719a94d3fecc4159a748345c757a49a3',
  errorCode: 400002,
  errorDetails: 'Missing required parameter : baseDomain',
  errorMessage: 'Missing required parameter',
  statusCode: 400,
  statusReason: CommonTestData.badRequest,
  apiVersion: 2,
  time: Date.now(),
}

const expectedGigyaResponseInvalidDataCenter = {
  callId: '75f069be75f742f4a82d5bdf75bdd475',
  errorCode: 500001,
  errorDetails: 'Datacenter is invalid',
  errorMessage: 'General Server Error',
  apiVersion: 2,
  statusCode: 500,
  statusReason: 'Internal Server Error',
  deleted: false,
  time: Date.now(),
}

const multipleParentWithMultipleChildrenRequest = {
  sites: [
    {
      baseDomain: `${DOMAIN_PREFIX}p1.com`,
      description: 'parent 1 description',
      dataCenter: 'us1',
      isChildSite: false,
      tempId: parent1SiteId,
      parentSiteId: '',
      childSites: [
        {
          baseDomain: `${DOMAIN_PREFIX}p1.c1.com`,
          description: 'parent 1 child 1 description',
          dataCenter: 'us1',
          isChildSite: true,
          tempId: parent1SiteId + child1SiteId,
          parentSiteId: parent1SiteId,
        },
        {
          baseDomain: `${DOMAIN_PREFIX}p1.c2.com`,
          description: 'parent 1 child 2 description',
          dataCenter: 'us1',
          isChildSite: true,
          tempId: parent1SiteId + child2SiteId,
          parentSiteId: parent1SiteId,
        },
      ],
    },
    {
      baseDomain: `${DOMAIN_PREFIX}p2.com`,
      description: 'parent 2 description',
      dataCenter: 'au1',
      isChildSite: false,
      tempId: parent2SiteId,
      parentSiteId: '',
      childSites: [
        {
          baseDomain: `${DOMAIN_PREFIX}p2.c1.com`,
          description: 'parent 2 child 1 description',
          dataCenter: 'au1',
          isChildSite: true,
          tempId: parent2SiteId + child1SiteId,
          parentSiteId: parent2SiteId,
        },
        {
          baseDomain: `${DOMAIN_PREFIX}p2.c2.com`,
          description: 'parent 2 child 2 description',
          dataCenter: 'au1',
          isChildSite: true,
          tempId: parent2SiteId + child2SiteId,
          parentSiteId: parent2SiteId,
        },
      ],
    },
  ],
  partnerID: CommonTestData.siteCredentials.partnerId,
  userKey: CommonTestData.siteCredentials.userKey,
  secret: CommonTestData.siteCredentials.secret,
}

const sdExpectedDeleteTokenSuccessfully = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  time: Date.now(),
  deleteToken: 'token',
}
const sdExpectedGigyaResponseDeletedSite = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  time: Date.now(),
}

const sdSiteAlreadyDeleted = {
  callId: 'callId',
  errorCode: 403007,
  errorDetails: 'Site was deleted',
  errorMessage: 'Permission denied',
  apiVersion: 2,
  statusCode: 403,
  statusReason: 'Forbidden',
  time: Date.now(),
}

const sdDeleteGroupSitesFirst = {
  errorMessage: 'No user permission',
  errorDetails: "You can't delete this site because it's a group site. Please delete it's member sites first.",
  statusCode: 403,
  errorCode: 403023,
  statusReason: 'Forbidden',
  callId: 'callId',
  time: Date.now(),
}

const expectedGigyaErrorApiRateLimit = {
  callId: 'callId',
  errorCode: 403048,
  errorDetails: 'Api Rate limit exceeded',
  errorMessage: 'Api rate limit exceeded',
  apiVersion: 2,
  statusCode: 403,
  statusReason: 'Forbidden',
  time: Date.now(),
}

function createMultipleParentWithMultipleChildrenRequest() {
  return JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
}

function createSingleParentRequest() {
  const clone = JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
  clone.sites.splice(1, 1)
  clone.sites[0].childSites.splice(0, clone.sites[0].childSites.length)
  return clone
}

function createParentWithOneChildRequest() {
  const clone = JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
  clone.sites.splice(1, 1)
  clone.sites[0].childSites.splice(1, 1)
  return clone
}

function createParentWithTwoChildRequest() {
  const clone = JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
  clone.sites.splice(1, 1)
  return clone
}

function createObject(numberOfParents, numberOfChildrenPerParent) {
  const obj = {
    sites: [],
    partnerID: `${CommonTestData.siteCredentials.partnerId}`,
    userKey: `${CommonTestData.siteCredentials.userKey}`,
    secret: `${CommonTestData.siteCredentials.secret}`,
  }
  for (let p = 0; p < numberOfParents; ++p) {
    const parent = createParent(p)
    obj.sites.push(parent)
    for (let c = 0; c < numberOfChildrenPerParent; ++c) {
      const child = createChild(parent, c)
      parent.childSites.push(child)
    }
  }
  //console.log(`Created Object ${JSON.stringify(obj)}`)
  return obj
}

function createParent(id) {
  return {
    baseDomain: `${DOMAIN_PREFIX}p${id}.com`,
    description: `parent ${id} description`,
    dataCenter: 'us1',
    isChildSite: false,
    tempId: `p${id}`,
    parentSiteId: '',
    childSites: [],
  }
}

function createChild(parent, id) {
  return {
    baseDomain: `${DOMAIN_PREFIX}${parent.tempId}.c${id}.com`,
    description: `${parent.tempId} child ${id} description`,
    dataCenter: `${parent.dataCenter}`,
    isChildSite: true,
    tempId: `${parent.tempId}c${id}`,
    parentSiteId: `p${id}`,
  }
}

export {
  Endpoints,
  DOMAIN_PREFIX,
  expectedGigyaResponseOk,
  expectedGigyaResponseNoSecret,
  expectedGigyaResponseNoUserKey,
  expectedGigyaResponseNoPartnerId,
  expectedGigyaResponseNoBaseDomain,
  expectedGigyaResponseInvalidDataCenter,
  sdExpectedGigyaResponseDeletedSite,
  sdExpectedDeleteTokenSuccessfully,
  sdSiteAlreadyDeleted,
  sdDeleteGroupSitesFirst,
  expectedGigyaErrorApiRateLimit,
  createSingleParentRequest,
  createParentWithOneChildRequest,
  createParentWithTwoChildRequest,
  createMultipleParentWithMultipleChildrenRequest,
  createObject,
}
