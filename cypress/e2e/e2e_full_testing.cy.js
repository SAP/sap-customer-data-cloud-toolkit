/* eslint-disable no-undef */
import SiteManager from '../../src/services/site/siteManager'
import * as utils from './utils'
import * as data from '../../src/services/site/data_test'

describe('Site Deployer Test Suite', () => {
  const payload = {
    sites: [
      {
        baseDomain: 'p2.com',
        description: 'parent 2 description',
        dataCenter: 'us1',
        isChildSite: false,
        tempId: '123',
        parentSiteId: '',
        childSites: [
          {
            baseDomain: 'p2.c1.com',
            description: 'parent 2 child 1 description',
            dataCenter: 'us1',
            isChildSite: true,
            tempId: 'parent1SiteId',
            parentSiteId: 'parent1SiteId',
          },
        ],
      },
    ],
    partnerID: 'partnerId',
    userKey: 'userKey',
    secret: 'secret',
    errors: [],
    showSuccessDialog: false,
    dataCenters: [
      {
        label: 'US',
        value: 'us1',
      },
    ],
  }

  beforeEach(() => {
    const siteManager = new SiteManager({
      partnerID: 12345,
      userKey: '123123123123qsdq',
      secret: 'asd8981uds',
    })
    siteManager.create(payload)
    utils.startUp('Sites')
  })
  it('should display Export All and Import All buttons', () => {})
})
