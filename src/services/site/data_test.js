const HttpStatus = {
  OK: 200,
  //   BAD_REQUEST: 400,
  //   INTERNAL_SERVER_ERROR: 500,
}

const Endpoints = {
  SITE_CREATE: 'admin.createSite',
  SITE_CONFIG: 'admin.setSiteConfig',
}

const badRequest = 'Bad Request'
const invalidApiParam = 'Invalid ApiKey parameter'

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
  time: Date.now(),
}

const expectedGigyaResponseNoUserKey = expectedGigyaResponseNoSecret

const expectedGigyaResponseNoPartnerId = {
  callId: '719a94d3fecc4159a748345c757a49a3',
  errorCode: 400002,
  errorDetails: 'Missing required parameter : partnerID',
  errorMessage: 'Missing required parameter',
  statusCode: 400,
  statusReason: badRequest,
  apiVersion: 2,
  time: Date.now(),
}

const expectedGigyaResponseNoBaseDomain = {
  callId: '719a94d3fecc4159a748345c757a49a3',
  errorCode: 400002,
  errorDetails: 'Missing required parameter : baseDomain',
  errorMessage: 'Missing required parameter',
  statusCode: 400,
  statusReason: badRequest,
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
const scExpectedGigyaResponseWithDifferentDataCenter = {
  errorMessage: 'Database error',
  statusCode: 500,
  errorCode: 500028,
  statusReason: 'Internal Server Error',
  callId: '5bb29720dc404dad94b5b6d4ac82c68d',
  time: Date.now(),
}

const scExpectedGigyaResponseOk = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  time: Date.now(),
}

const scExpectedGigyaResponseNotOk = {
  errorMessage: invalidApiParam,
  errorDetails: 'GSKeyBase is invalid, no version: apiKey',
  statusCode: 400,
  errorCode: 400093,
  statusReason: badRequest,
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
      tempId: parent1SiteId,
      parentSiteId: '',
      childSites: [
        {
          baseDomain: 'p1.c1.com',
          description: 'parent 1 child 1 description',
          dataCenter: 'us1',
          isChildSite: true,
          tempId: parent1SiteId + child1SiteId,
          parentSiteId: parent1SiteId,
        },
        {
          baseDomain: 'p1.c2.com',
          description: 'parent 1 child 2 description',
          dataCenter: 'us1',
          isChildSite: true,
          tempId: parent1SiteId + child2SiteId,
          parentSiteId: parent1SiteId,
        },
      ],
    },
    {
      baseDomain: 'p2.com',
      description: 'parent 2 description',
      dataCenter: 'au1',
      isChildSite: false,
      tempId: parent2SiteId,
      parentSiteId: '',
      childSites: [
        {
          baseDomain: 'p2.c1.com',
          description: 'parent 2 child 1 description',
          dataCenter: 'au1',
          isChildSite: true,
          tempId: parent2SiteId + child1SiteId,
          parentSiteId: parent2SiteId,
        },
        {
          baseDomain: 'p2.c2.com',
          description: 'parent 2 child 2 description',
          dataCenter: 'au1',
          isChildSite: true,
          tempId: parent2SiteId + child2SiteId,
          parentSiteId: parent2SiteId,
        },
      ],
    },
  ],
  partnerID: 'partnerId',
  userKey: 'userKey',
  secret: 'secret',
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

const expectedGigyaResponseInvalidAPI = {
  callId: 'callId',
  errorCode: 400093,
  errorDetails: invalidApiParam,
  errorMessage: invalidApiParam,
  apiVersion: 2,
  statusCode: 400,
  statusReason: badRequest,
  time: Date.now(),
}

const scGetSiteConfigSuccessfully = {
  callId: 'callId',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: Date.now(),
  baseDomain: 'a_b_c_',
  dataCenter: 'au1',
  trustedSiteURLs: ['a_b_c_site/*', '*.a_b_c_site/*'],
  tags: [],
  description: 'site',
  captchaProvider: 'Google',
  settings: {
    CNAME: '',
    shortURLDomain: '',
    shortURLRedirMethod: 'js',
    encryptPII: true,
  },
  siteGroupConfig: {
    members: [],
    enableSSO: false,
  },
  trustedShareURLs: ['bit.ly/*', 'fw.to/*', 'shr.gs/*', 'vst.to/*', 'socli.ru/*', 's.gigya-api.cn/*'],
  enableDataSharing: true,
  isCDP: false,
  invisibleRecaptcha: {},
  recaptchaV2: {},
  funCaptcha: {},
}

const scGetSiteConfigSuccessfullyMultipleMember = {
  callId: 'callId',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: Date.now(),
  baseDomain: 'a_b_c_',
  dataCenter: 'au1',
  trustedSiteURLs: ['a_b_c_site/*', '*.a_b_c_site/*'],
  tags: [],
  description: 'site',
  captchaProvider: 'Google',
  settings: {
    CNAME: '',
    shortURLDomain: '',
    shortURLRedirMethod: 'js',
    encryptPII: true,
  },
  siteGroupConfig: {
    members: ['member1'],
    enableSSO: false,
  },
  trustedShareURLs: ['bit.ly/*', 'fw.to/*', 'shr.gs/*', 'vst.to/*', 'socli.ru/*', 's.gigya-api.cn/*'],
  enableDataSharing: true,
  isCDP: false,
  invisibleRecaptcha: {},
  recaptchaV2: {},
  funCaptcha: {},
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

export {
  HttpStatus,
  Endpoints,
  expectedGigyaResponseOk,
  expectedGigyaResponseNoSecret,
  expectedGigyaResponseNoUserKey,
  expectedGigyaResponseNoPartnerId,
  expectedGigyaResponseNoBaseDomain,
  expectedGigyaResponseInvalidDataCenter,
  scExpectedGigyaResponseWithDifferentDataCenter,
  scExpectedGigyaResponseOk,
  scExpectedGigyaResponseNotOk,
  sdExpectedGigyaResponseDeletedSite,
  expectedGigyaResponseInvalidAPI,
  scGetSiteConfigSuccessfully,
  sdExpectedDeleteTokenSuccessfully,
  scGetSiteConfigSuccessfullyMultipleMember,
  sdSiteAlreadyDeleted,
  sdDeleteGroupSitesFirst,
  invalidApiParam,
  createSingleParentRequest,
  createParentWithOneChildRequest,
  createParentWithTwoChildRequest,
  createMultipleParentWithMultipleChildrenRequest,
  verifyResponseIsOk,
  verifyResponseIsNotOk,
}
