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
  test('export communication data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedCommunicationResponse })
    const response = await communicationImport.exportTopicData()
    expect(response).toEqual(expectedCleanCommunicationResponse)
  })

  test('export transformed communication data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedCommunicationResponse })
    const response = await communicationImport.exportTransformedCommunicationData()
    expect(response).toEqual(expectedTransformedCommunicationData)
  })
  test('export transformed communication data successfully', async () => {
    const response = communicationImport.getTopicsData(expectedCommunicationResponse)
    expect(response).toEqual(expectedGetCommunicationsData)
  })
})
