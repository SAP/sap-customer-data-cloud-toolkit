import axios from 'axios'
import { credentials } from '../../servicesDataTest'
import SchemaImportFields from './schemaImportFields'
import { expectedSchemaResponse, expectedSchemaResponseCleaned, transformedSchema } from './schemaDatatest'
import { extractAndTransformSchemaFields } from './transformSchemaFields'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const schemaImport = new SchemaImportFields(credentials, 'apiKey', 'eu1')
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('export schema data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.exportSchemaData()
    expect(response).toEqual(expectedSchemaResponseCleaned)
  })
  test('export transformed schema data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.exportTransformedSchemaData()
    expect(response).toEqual(transformedSchema)
  })

  //   test('export lite schema data successfully', async () => {
  //     axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
  //     const response = await schemaImport.exportLiteSchemaData()
  //     const transformedData = extractAndTransformSchemaFields(expectedLiteSchemaResponseCleaned)
  //     expect(response).toEqual(transformedData)
  //   })
})
