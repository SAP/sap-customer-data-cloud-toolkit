/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import * as CommonTestData from '../servicesDataTest.js'
import * as TestData from '../configurator/dataTest.js'
import GigyaManager from './gigyaManager.js'
import axios from 'axios'
import SiteConfigurator from '../configurator/siteConfigurator.js'

jest.mock('axios')

describe('Emails Manager test suite', () => {
  const gigyaManager = new GigyaManager('userKey', 'secret')

  test('error getting data center', async () => {
    const err = CommonTestData.createErrorObject(SiteConfigurator.ERROR_MSG_CONFIG)
    axios.mockImplementation(() => {
      throw err
    })
    const response = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(response.errorCode).not.toBe(0)
    expect(response.dataCenter).toBeUndefined()
    expect(response.errorMessage).toEqual(err.message)
  })

  test('get data center', async () => {
    const expectedResponse = TestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValue({ data: expectedResponse })
    const response = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(response.errorCode).toBe(0)
    expect(response.dataCenter).toBe(expectedResponse.dataCenter)
  })
})
