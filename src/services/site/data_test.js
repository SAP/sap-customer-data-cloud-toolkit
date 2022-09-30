const URL = 'https://admin.us1.gigya.com'
const CREATE_SITE_ENDPOINT = URL + CREATE_SITE
const SET_SITE_CONFIG_ENDPOINT = URL + SET_SITE_CONFIG

const parent1SiteId = 'idP1'
const parent2SiteId = 'idP2'
const child1SiteId = 'C1'
const child2SiteId = 'C2'

const expectedGigyaResponseOk = {
	APIKey: 'apiKey',
	StatusCode: 200,
	ErrorCode: 0,
	StatusReason: 'OK',
	CallID: 'callId',
	ApiVersion: 2,
}

const expectedGigyaResponseNoSecret = {
	ErrorMessage: 'Permission denied',
	ErrorDetails:
		'Invalid namespace &#39;admin&#39; or method &#39;createSite&#39; or you do not have the required permissions to call it. ',
	StatusCode: 403,
	ErrorCode: 403007,
	StatusReason: 'Forbidden',
	CallID: 'ed5c54bfe321478b8db4298c2539265a',
	ApiVersion: 2,
	Time: time.Now(),
}

const expectedGigyaResponseNoUserKey = expectedGigyaResponseNoSecret

const expectedGigyaResponseNoPartnerId = {
	CallID: '719a94d3fecc4159a748345c757a49a3',
	ErrorCode: 400002,
	ErrorDetails: 'Missing required parameter : partnerID',
	ErrorMessage: 'Missing required parameter',
	StatusCode: 400,
	StatusReason: 'Bad Request',
	ApiVersion: 2,
}

const expectedGigyaResponseNoBaseDomain = {
	CallID: '719a94d3fecc4159a748345c757a49a3',
	ErrorCode: 400002,
	ErrorDetails: 'Missing required parameter : baseDomain',
	ErrorMessage: 'Missing required parameter',
	StatusCode: 400,
	StatusReason: 'Bad Request',
	ApiVersion: 2,
}

const expectedGigyaResponseInvalidDataCenter = {
	CallID: '75f069be75f742f4a82d5bdf75bdd475',
	ErrorCode: 500001,
	ErrorDetails: 'Datacenter is invalid',
	ErrorMessage: 'General Server Error',
	ApiVersion: 2,
	StatusCode: 500,
	StatusReason: 'Internal Server Error',
	Deleted: false,
}
const expectedGigyaResponseWithDifferentDataCenter = {
	ErrorMessage: 'Database error',
	StatusCode: 500,
	ErrorCode: 500028,
	StatusReason: 'Internal Server Error',
	CallID: '5bb29720dc404dad94b5b6d4ac82c68d',
}
const expectedDeletedSiteSuccesfully = {
	ErrorMessage: '',
	ErrorDetails: '',
	StatusCode: 200,
	ErrorCode: 0,
	StatusReason: 'OK',
	CallID: '5cf4f900dc1c4b4f86c2f99ccb2c5250',
	APIKey: 'apiKey',
	ApiVersion: 0,
	SiteUiId: '',
	Deleted: true,
}
const expectedErrorInvalidAPI = {
	ErrorMessage: 'Invalid ApiKey parameter',
	ErrorDetails: '',
	StatusCode: 400,
	ErrorCode: 400093,
	StatusReason: 'Bad Request',
	CallID: '5cf4f900dc1c4b4f86c2f99ccb2c5250',
	APIKey: 'asjdshds',
	ApiVersion: 0,
	SiteUiId: '',
	Deleted: false,
}
const expectedErrorAPIAlreadyDeleted = {
	ErrorMessage: 'Permission denied',
	ErrorDetails: 'Site was deleted',
	StatusCode: 400,
	ErrorCode: 403007,
	StatusReason: 'Forbidden',
	CallID: '5cf4f900dc1c4b4f86c2f99ccb2c5250',
	APIKey: 'apiKey',
	ApiVersion: 0,
	SiteUiId: '',
	Deleted: false,
}
const multipleParentWithMultipleChildrenRequest = {
	Sites: [
		{
			BaseDomain: 'p1.com',
			Description: 'parent 1 description',
			DataCenter: 'us1',
			IsChildSite: false,
			Id: parent1SiteId,
			ParentSiteId: '',
			ChildSites: [
				{
					BaseDomain: 'p1.c1.com',
					Description: 'parent 1 child 1 description',
					DataCenter: 'us1',
					IsChildSite: true,
					Id: parent1SiteId + child1SiteId,
					ParentSiteId: parent1SiteId,
				},
				{
					BaseDomain: 'p1.c2.com',
					Description: 'parent 1 child 2 description',
					DataCenter: 'us1',
					IsChildSite: true,
					Id: parent1SiteId + child2SiteId,
					ParentSiteId: parent1SiteId,
				},
			],
		},
		{
			BaseDomain: 'p2.com',
			Description: 'parent 2 description',
			DataCenter: 'au1',
			IsChildSite: false,
			Id: parent2SiteId,
			ParentSiteId: '',
			ChildSites: [
				{
					BaseDomain: 'p2.c1.com',
					Description: 'parent 2 child 1 description',
					DataCenter: 'au1',
					IsChildSite: true,
					Id: parent2SiteId + child1SiteId,
					ParentSiteId: parent2SiteId,
				},
				{
					BaseDomain: 'p2.c2.com',
					Description: 'parent 2 child 2 description',
					DataCenter: 'au1',
					IsChildSite: true,
					Id: parent2SiteId + child2SiteId,
					ParentSiteId: parent2SiteId,
				},
			],
		},
	],
	PartnerID: 'partnerId',
	UserKey: 'userKey',
	Secret: 'secret',
}

function createMultipleParentWithMultipleChildrenRequest() {
	//return JSON.parse(JSON.stringify(multipleParentWithMultipleChildrenRequest))
	return Object.assign({}, multipleParentWithMultipleChildrenRequest)
}

function createSingleParentRequest() {
	let clone = Object.assign({}, multipleParentWithMultipleChildrenRequest)
	delete clone.Sites[1]
	delete clone.Sites[0].ChildSites
	return clone
}

function createParentWithOneChildRequest() {
	let clone = Object.assign({}, multipleParentWithMultipleChildrenRequest)
	delete clone.Sites[1]
	delete clone.Sites[0].ChildSites[1]
	return clone
}

function createParentWithTwoChildRequest() {
	let clone = Object.assign({}, multipleParentWithMultipleChildrenRequest)
	delete clone.Sites[1]
	return clone
}
