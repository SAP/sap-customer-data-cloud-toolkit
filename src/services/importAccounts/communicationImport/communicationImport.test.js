/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import TopicImportFields from './communicationImport'
import { expectedCleanCommunicationResponse, expectedCommunicationResponse, expectedGetCommunicationsData, expectedTransformedCommunicationData } from './dataTest'
import axios from 'axios'
import { credentials } from '../../servicesDataTest'
jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - communicationImport test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const communicationImport = new TopicImportFields(credentials, targetApiKey, targetDataCenter)
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Get clean communication data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedCommunicationResponse })
    const response = await communicationImport.exportTopicData()
    expect(response).toEqual(expectedCleanCommunicationResponse)
  })
  test('Export transformed communication data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedCommunicationResponse })
    const response = await communicationImport.exportTransformedCommunicationData()
    expect(response).toEqual(expectedTransformedCommunicationData)
  })
  test('Get communication data successfully', async () => {
    const response = communicationImport.getTopicsData(expectedCommunicationResponse)
    expect(response).toEqual(expectedGetCommunicationsData)
  })
})
