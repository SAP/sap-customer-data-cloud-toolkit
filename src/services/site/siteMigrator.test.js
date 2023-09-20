/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import SiteMigrator from './siteMigrator.js'
import * as TestData from './dataTest.js'
import axios from 'axios'
import * as CommonTestData from '../servicesDataTest.js'

jest.mock('axios')

describe('Site Migrator test suite', () => {
  const credentials = CommonTestData.siteCredentials
  const siteMigrator = new SiteMigrator(credentials.userKey, credentials.secret)

  test('migrate site successfully', async () => {
    axios.mockResolvedValueOnce({ data: TestData.expectedGigyaResponseOk })
    const response = await siteMigrator.migrateConsentFlow('apiKey', 'eu1')
    verifyResponseIsOk(response.data)
  })

  test('migrate site exception', async () => {
    const err = CommonTestData.createErrorObject('Error migrating site consents')
    axios.mockImplementation(() => {
      throw err
    })

    const response = await siteMigrator.migrateConsentFlow('apiKey', 'eu1')

    expect(response.data.errorCode).toEqual(err.code)
    expect(response.data.errorMessage).toEqual(err.message)
    expect(response.data.time).toBeDefined()
  })
})

function verifyResponseIsOk(response) {
  CommonTestData.verifyResponseIsOk(response)
  expect(response.apiKey).toBeDefined()
  expect(response.apiVersion).toBeDefined()
}
