import axios from 'axios'
import { credentials } from '../../servicesDataTest'
import SchemaImportFields from './schemaImportFields'
import { expectedLiteSchemaResponse, expectedSchemaResponse, expectedSchemaResponseCleaned, transformedSchema } from './schemaDatatest'
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

  test('export lite schema data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.exportLiteSchemaData()
    console.log('response', response)
    expect(response).toEqual(expectedSchemaResponseCleaned)
  })

  test('get schema data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.getSchema()
    expect(response).toEqual(expectedLiteSchemaResponse)
  })

  test('clean schema data successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    schemaImport.cleanSchemaData(schemaResponse)
    expect(schemaResponse).toEqual(expectedSchemaResponseCleaned)
  })

  test('clean lite schema data successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    const cleanedSchema = schemaImport.cleanLiteSchemaData(schemaResponse)
    expect(cleanedSchema).toEqual(expectedSchemaResponseCleaned)
  })

  test('remove field from addresses schema successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    schemaImport.removeFieldFromAddressesSchema(schemaResponse)
    expect(schemaResponse).toEqual(expectedSchemaResponseCleaned)
  })

  test('remove field from subscription schema successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    schemaImport.removeFieldFromSubscriptionSchema(schemaResponse)
    expect(schemaResponse).toEqual(expectedSchemaResponseCleaned)
  })

  test('handle error in export schema data', async () => {
    const errorResponse = { errorCode: 1, errorMessage: 'Error' }
    axios.mockResolvedValueOnce({ data: errorResponse })
    const response = await schemaImport.exportSchemaData()
    expect(response).toEqual(errorResponse)
  })

  //   test('export lite schema data successfully', async () => {
  //     axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
  //     const response = await schemaImport.exportLiteSchemaData()
  //     const transformedData = extractAndTransformSchemaFields(expectedLiteSchemaResponseCleaned)
  //     expect(response).toEqual(transformedData)
  //   })
})
