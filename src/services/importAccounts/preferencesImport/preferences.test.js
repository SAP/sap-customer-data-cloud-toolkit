/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import axios from 'axios'
import PreferencesImportFields from './preferencesImport'
import { mockCleanPreferencesResponse, mockPreferencesResponse, mockTransformPreferencesResponse } from './dataTest'
import { credentials } from '../../servicesDataTest'

jest.mock('axios')
jest.setTimeout(10000)

describe('PreferencesImportFields test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const preferencesImport = new PreferencesImportFields(credentials, targetApiKey, targetDataCenter)
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('export preferences data successfully', async () => {
    axios.mockResolvedValueOnce({ data: mockPreferencesResponse })
    const response = await preferencesImport.getPreferencesData()
    expect(response).toEqual(mockCleanPreferencesResponse)
  })

  test('export transformed preferences data successfully', async () => {
    axios.mockResolvedValue({ data: mockCleanPreferencesResponse })
    const response = await preferencesImport.exportTransformedPreferencesData()
    expect(response).toEqual(mockTransformPreferencesResponse)
  })

  test('get preferences successfully', async () => {
    axios.mockResolvedValueOnce({ data: mockPreferencesResponse })
    const response = await preferencesImport.getPreferences()
    expect(response).toEqual(mockPreferencesResponse)
  })

  test('get preferences data without metadata', () => {
    const cleanedData = preferencesImport.cleanPreferencesResponse(mockPreferencesResponse)
    expect(cleanedData).toEqual(mockCleanPreferencesResponse)
  })
})
