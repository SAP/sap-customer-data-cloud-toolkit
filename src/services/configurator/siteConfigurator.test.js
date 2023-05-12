/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import SiteConfigurator from './siteConfigurator'
import * as TestData from './dataTest'
import * as CommonTestData from '../servicesDataTest'
import axios from 'axios'

jest.mock('axios')
jest.setTimeout(10000)

describe('Site configurator test suite', () => {
  const siteConfigurator = new SiteConfigurator(CommonTestData.credentials.userKey, CommonTestData.credentials.secret)
  const dataCenter = 'us1'
  const parentApiKey = 'parentApiKey'
  const childApiKey = 'childApiKey'

  test('configure site successfully', async () => {
    const mockedResponse = { data: TestData.scExpectedGigyaResponseOk }
    axios.mockResolvedValue(mockedResponse)

    const response = await siteConfigurator.connect(parentApiKey, childApiKey, dataCenter)
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response.data)
  })

  test('configure site unsuccessfully - api key do not exists', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseNotOk
    axios.mockResolvedValue({ data: expectedResponse })

    const response = await siteConfigurator.connect(parentApiKey, childApiKey + '_NOT_EXISTS', dataCenter)

    CommonTestData.verifyResponseIsNotOk(response.data, expectedResponse)
  })

  test('configure site unsuccessfully - data centers are different', async () => {
    const expectedResponse = TestData.scExpectedGigyaResponseWithDifferentDataCenter
    axios.mockResolvedValue({ data: expectedResponse })

    const response = await siteConfigurator.connect(parentApiKey, childApiKey, dataCenter)

    CommonTestData.verifyResponseIsNotOk(response.data, expectedResponse)
  })

  test('get site config successfully', async () => {
    const expectedResponse = TestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValue({ data: expectedResponse })

    let response = await siteConfigurator.getSiteConfig(parentApiKey, dataCenter)

    CommonTestData.verifyResponseIsOk(response)
  })

  test('send request to invalid url', async () => {
    const err = CommonTestData.createErrorObject(SiteConfigurator.ERROR_MSG_CONFIG)
    axios.mockImplementation(() => {
      throw err
    })

    const response = await siteConfigurator.connect(parentApiKey, childApiKey, dataCenter)

    expect(response.data.errorCode).toEqual(err.code)
    expect(response.data.errorMessage).toEqual(err.message)
    expect(response.data.time).toBeDefined()
  })
})
