const HttpStatus = {
  OK: 200,
  //   BAD_REQUEST: 400,
  //   INTERNAL_SERVER_ERROR: 500,
}

const Endpoints = {
  SITE_CREATE: 'admin.createSite',
  SITE_CONFIG: 'admin.setSiteConfig',
}

const parent1SiteId = 'idP1'
const parent2SiteId = 'idP2'
const child1SiteId = 'C1'
const child2SiteId = 'C2'

const expectedGigyaResponseOk = {
  apiKey: 'apiKey',
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  apiVersion: 2,
  time: Date.now(),
}

const expectedGigyaResponseNoSecret = {
  errorMessage: 'Permission denied',
  errorDetails: 'Invalid namespace &#39;admin&#39; or method &#39;createSite&#39; or you do not have the required permissions to call it. ',
  statusCode: 403,
  errorCode: 403007,
  statusReason: 'Forbidden',
  callId: 'ed5c54bfe321478b8db4298c2539265a',
  apiVersion: 2,
  time: '',
}

const expectedGigyaResponseNoUserKey = expectedGigyaResponseNoSecret

const expectedGigyaResponseNoPartnerId = {
  callId: '719a94d3fecc4159a748345c757a49a3',
  errorCode: 400002,
  errorDetails: 'Missing required parameter : partnerID',
  errorMessage: 'Missing required parameter',
  statusCode: 400,
  statusReason: 'Bad Request',
  apiVersion: 2,
  time: Date.now(),
}

const expectedGigyaResponseNoBaseDomain = {
  callId: '719a94d3fecc4159a748345c757a49a3',
  errorCode: 400002,
  errorDetails: 'Missing required parameter : baseDomain',
  errorMessage: 'Missing required parameter',
  statusCode: 400,
  statusReason: 'Bad Request',
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
const expectedGigyaResponseWithDifferentDataCenter = {
  errorMessage: 'Database error',
  statusCode: 500,
  errorCode: 500028,
  statusReason: 'Internal Server Error',
  callId: '5bb29720dc404dad94b5b6d4ac82c68d',
  time: Date.now(),
}

const expectedDeletedSiteSuccesfully = {
  errorMessage: '',
  errorDetails: '',
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: '5cf4f900dc1c4b4f86c2f99ccb2c5250',
  aPIKey: 'apiKey',
  apiVersion: 0,
  siteUiId: '',
  deleted: true,
}
const expectedErrorInvalidAPI = {
  errorMessage: 'Invalid ApiKey parameter',
  errorDetails: '',
  statusCode: 400,
  errorCode: 400093,
  statusReason: 'Bad Request',
  callId: '5cf4f900dc1c4b4f86c2f99ccb2c5250',
  // aPIKey: 'asjdshds',
  // apiVersion: 0,
  // siteUiId: '',
  // deleted: false,
}
const expectedErrorAPIAlreadyDeleted = {
  errorMessage: 'Permission denied',
  errorDetails: 'Site was deleted',
  statusCode: 400,
  errorCode: 403007,
  statusReason: 'Forbidden',
  callId: '5cf4f900dc1c4b4f86c2f99ccb2c5250',
  // aPIKey: 'apiKey',
  // apiVersion: 0,
  // siteUiId: '',
  // deleted: false,
}
const scExpectedGigyaResponseOk = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  time: Date.now(),
}

const scExpectedGigyaResponseNotOk = {
  errorMessage: 'Invalid ApiKey parameter',
  errorDetails: 'GSKeyBase is invalid, no version: apiKey',
  statusCode: 400,
  errorCode: 400093,
  statusReason: 'Bad Request',
  callId: 'f659eb2a4590410c90cd55c25c8defa1',
  time: Date.now(),
}

const multipleParentWithMultipleChildrenRequest = {
  sites: [
    {
      baseDomain: 'p1.com',
      description: 'parent 1 description',
      dataCenter: 'us1',
      isChildSite: false,
      id: parent1SiteId,
      parentSiteId: '',
      childSites: [
        {
          baseDomain: 'p1.c1.com',
          description: 'parent 1 child 1 description',
          dataCenter: 'us1',
          isChildSite: true,
          id: parent1SiteId + child1SiteId,
          parentSiteId: parent1SiteId,
        },
        {
          baseDomain: 'p1.c2.com',
          description: 'parent 1 child 2 description',
          dataCenter: 'us1',
          isChildSite: true,
          id: parent1SiteId + child2SiteId,
          parentSiteId: parent1SiteId,
        },
      ],
    },
    {
      baseDomain: 'p2.com',
      description: 'parent 2 description',
      dataCenter: 'au1',
      isChildSite: false,
      id: parent2SiteId,
      parentSiteId: '',
      childSites: [
        {
          baseDomain: 'p2.c1.com',
          description: 'parent 2 child 1 description',
          dataCenter: 'au1',
          isChildSite: true,
          id: parent2SiteId + child1SiteId,
          parentSiteId: parent2SiteId,
        },
        {
          baseDomain: 'p2.c2.com',
          description: 'parent 2 child 2 description',
          dataCenter: 'au1',
          isChildSite: true,
          id: parent2SiteId + child2SiteId,
          parentSiteId: parent2SiteId,
        },
      ],
    },
  ],
  partnerID: 'partnerId',
  userKey: 'userKey',
  secret: 'secret',
}

function createMultipleParentWithMultipleChildrenRequest() {
  return JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
}

function createSingleParentRequest() {
  let clone = JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
  clone.sites.splice(1, 1)
  clone.sites[0].childSites.splice(0, clone.sites[0].childSites.length)
  return clone
}

function createParentWithOneChildRequest() {
  let clone = JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
  clone.sites.splice(1, 1)
  clone.sites[0].childSites.splice(1, 1)
  return clone
}

function createParentWithTwoChildRequest() {
  let clone = JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
  clone.sites.splice(1, 1)
  return clone
}

function verifyResponseIsOk(response) {
  expect(response.statusCode).toBeDefined()
  expect(response.statusCode).toEqual(HttpStatus.OK)
  expect(response.statusReason).toEqual('OK')
  expect(response.callId).toBeDefined()
  expect(response.time).toBeDefined()
  // error case
  expect(response.errorMessage).toBeUndefined()
  expect(response.errorCode).toEqual(0)
  expect(response.errorDetails).toBeUndefined()
}

function verifyResponseIsNotOk(response, expectedResponse) {
  expect(response.statusCode).toEqual(expectedResponse.statusCode)
  expect(response.statusReason).toEqual(expectedResponse.statusReason)
  expect(response.callId).toBeDefined()
  expect(response.time).toBeDefined()
  // error case
  expect(response.errorMessage).toEqual(expectedResponse.errorMessage)
  expect(response.errorCode).toEqual(expectedResponse.errorCode)
  expect(response.errorDetails).toEqual(expectedResponse.errorDetails)
}

module.exports = {
  HttpStatus,
  expectedGigyaResponseOk,
  expectedGigyaResponseNoSecret,
  expectedGigyaResponseNoUserKey,
  expectedGigyaResponseNoPartnerId,
  expectedGigyaResponseNoBaseDomain,
  expectedGigyaResponseInvalidDataCenter,
  expectedGigyaResponseWithDifferentDataCenter,
  scExpectedGigyaResponseOk,
  scExpectedGigyaResponseNotOk,
  createSingleParentRequest,
  createParentWithOneChildRequest,
  createParentWithTwoChildRequest,
  createMultipleParentWithMultipleChildrenRequest,
  verifyResponseIsOk,
  verifyResponseIsNotOk,
}
