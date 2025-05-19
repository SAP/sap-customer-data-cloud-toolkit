import axios from 'axios'
import ConsentConfigurationManager from './consentConfigurationVersionControl'
import { credentials, getConsentStatementExpectedResponse, getLegalStatementExpectedResponse } from './dataTest'

jest.mock('axios')

describe('ConsentConfigurationManager test suite', () => {
  const apiKey = 'apiKey'
  const dataCenter = 'eu1'
  const consentConfigurationManager = new ConsentConfigurationManager(credentials, apiKey, dataCenter)
  const siteInfo = { dataCenter }

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

  test('setConsentsAndLegalStatements - success scenario', async () => {
    const content = getConsentStatementExpectedResponse

    axios.mockImplementation((config) => {
      if (config.url.includes('getLegalStatements')) {
        return Promise.resolve({
          data: { ...getLegalStatementExpectedResponse, errorCode: 0 },
        })
      }

      if (config.url.includes('getConsents')) {
        return Promise.resolve({
          data: { ...getConsentStatementExpectedResponse, errorCode: 0 },
        })
      }

      return Promise.resolve({ data: { errorCode: 0, severity: 'INFO' } })
    })

    const responses = await consentConfigurationManager.setConsentsAndLegalStatements(apiKey, siteInfo, content)

    expect(responses.flat().length).toBeGreaterThan(0) // Flatten responses for length check
    responses.flat().forEach((response) => {
      expect(response.errorCode).toBe(0) // Check for correct errorCode in response
      expect(response.severity).toBe('INFO') // Verify severity as expected
    })
  })

  test('setConsentsAndLegalStatements - error scenario', async () => {
    const content = getConsentStatementExpectedResponse

    axios.mockImplementation((config) => {
      if (config.url.includes('getLegalStatements')) {
        return Promise.resolve({
          data: { errorCode: 500, errorMessage: 'Internal Server Error' },
        })
      }

      if (config.url.includes('getConsents')) {
        return Promise.resolve({
          data: { errorCode: 500, errorMessage: 'Internal Server Error' },
        })
      }

      return Promise.resolve({ data: { errorCode: 500, errorMessage: 'Internal Server Error' } })
    })

    const responses = await consentConfigurationManager.setConsentsAndLegalStatements(apiKey, siteInfo, content)

    expect(responses.flat().length).toBeGreaterThan(0) // Flatten responses for length check
    responses.flat().forEach((response) => {
      expect(response.errorCode).toBe(500) // Check for correct errorCode in response
      expect(response.errorMessage).toBe('Internal Server Error') // Verify error message as expected
    })
  })

  test('copyLegalStatementsFromFile - success scenario', async () => {
    const legalStatementsPayload = [
      {
        consentId: 'terms.termsConsentId1',
        language: 'en',
        legalStatements: getLegalStatementExpectedResponse.legalStatements,
      },
      {
        consentId: 'terms.consentId2',
        language: 'pt',
        legalStatements: getLegalStatementExpectedResponse.legalStatements,
      },
    ]

    axios.mockImplementation((config) => {
      if (config.url.includes('setLegalStatements')) {
        return Promise.resolve({ data: { errorCode: 0, severity: 'INFO' } })
      }
      return Promise.resolve({ data: { errorCode: 0, severity: 'INFO' } })
    })

    const responses = await consentConfigurationManager.copyLegalStatementsFromFile(apiKey, siteInfo, legalStatementsPayload)

    expect(responses.length).toEqual(legalStatementsPayload.length) // Check the correct number of responses
    responses.forEach((response) => {
      expect(response.errorCode).toBe(0) // Ensure error code is 0
      expect(response.severity).toBe('INFO') // Verify severity as expected
    })
  })
})
