/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import SiteMigrator from './siteMigrator'
import * as TestData from './dataTest'
import axios from 'axios'
import * as CommonTestData from '../servicesDataTest'

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
