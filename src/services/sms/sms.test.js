/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import axios from 'axios'
import * as SmsTestData from './dataTest.js'
import Sms from './sms.js'
import * as CommonTestData from '../servicesDataTest.js'
import * as ConfiguratorTestData from '../configurator/dataTest.js'

jest.mock('axios')
jest.setTimeout(10000)

describe('Sms templates test suite', () => {
  const credentials = CommonTestData.credentials
  const sms = new Sms(credentials.userKey, credentials.secret)

  test('1 - get sms successfully - multiple sms templates', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: SmsTestData.getSmsExpectedResponse })

    const response = await sms.getSiteSms('apiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
    expect(response).toEqual(SmsTestData.getSmsExpectedResponse)
  })

  test('2 - get sms successfully - no templates', async () => {
    axios
      .mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) })
      .mockResolvedValueOnce({ data: SmsTestData.getSmsExpectedResponseWithNoTemplates() })

    const response = await sms.getSiteSms('apiKey')
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
    expect(response).toEqual(SmsTestData.getSmsExpectedResponseWithNoTemplates())
  })

  test('3 - get sms unsuccessfully - invalid apiKey', async () => {
    axios.mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseInvalidAPI })

    const response = await sms.getSiteSms('')
    CommonTestData.verifyResponseIsNotOk(response, CommonTestData.expectedGigyaResponseInvalidAPI)
  })

  test('4 - get sms unsuccessfully - invalid data center', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.scExpectedGigyaResponseNotOk })

    const response = await sms.getSiteSms('apiKey')
    CommonTestData.verifyResponseIsNotOk(response, ConfiguratorTestData.scExpectedGigyaResponseNotOk)
  })

  test('5 - set sms successfully', async () => {
    axios.mockResolvedValueOnce({ data: ConfiguratorTestData.getSiteConfigSuccessfullyMultipleMember(0) }).mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseOk })

    const response = await sms.setSiteSms('apiKey', SmsTestData.getSmsExpectedResponse.templates)
    //console.log('response=' + JSON.stringify(response))

    CommonTestData.verifyResponseIsOk(response)
  })
})
