/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import axios from 'axios'
import ConsentConfigurationManager from './consentConfigurationVersionControl'
import { credentials, getConsentStatementExpectedResponse, getLegalStatementExpectedResponse } from './dataTest'

jest.mock('axios')

describe('ConsentConfigurationManager test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const consentConfigurationManager = new ConsentConfigurationManager(credentials, apiKey, dataCenter)

  test('getConsentsAndLegalStatements - success scenario', async () => {
    axios
      .mockResolvedValueOnce({ data: getConsentStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })
      .mockResolvedValueOnce({ data: getLegalStatementExpectedResponse })

    const response = await consentConfigurationManager.getConsentsAndLegalStatements()

    expect(response.errorCode).toBe(0)
    expect(response.preferences).toBeDefined()
    const preferences = response.preferences
    for (const consentId in preferences) {
      const consent = preferences[consentId]
      expect(consent.legalStatements).toBeDefined()
      for (const language in consent.legalStatements) {
        const legalStatements = consent.legalStatements[language]
        expect(legalStatements).toBeDefined()
      }
    }
  })

  test('getConsentsAndLegalStatements - error scenario', async () => {
    const errorResponse = { errorCode: 500, errorMessage: 'Internal Server Error' }
    axios.mockResolvedValueOnce({ data: errorResponse })

    const response = await consentConfigurationManager.getConsentsAndLegalStatements()

    expect(response.errorCode).toBe(500)
    expect(response.errorMessage).toBe('Internal Server Error')
  })
})
