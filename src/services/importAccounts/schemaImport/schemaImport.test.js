import axios from 'axios'
import { credentials } from '../../servicesDataTest'
import SchemaImportFields from './schemaImportFields'
import {
  expectedSchemaCleanAddress,
  expectedSchemaLiteResponse,
  expectedSchemaResponse,
  expectedSchemaResponseCleaned,
  expectedSchemaResponseWithoutFields,
  expectedTransformedLiteCleanedResponsed,
  expectedTransformedLiteResponse,
  transformedSchema,
} from './schemaDatatest'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  const targetDataCenter = 'eu1'
  const targetApiKey = 'targetApiKey'
  const schemaImport = new SchemaImportFields(credentials, targetApiKey, targetDataCenter)
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
    expect(response).toEqual(expectedSchemaLiteResponse)
  })

  test('get schema data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.getSchema()
    expect(response).toEqual(expectedSchemaResponse)
  })

  test('clean lite schema data successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    const cleanedSchema = schemaImport.cleanLiteSchemaData(schemaResponse)
    expect(cleanedSchema).toEqual(expectedTransformedLiteResponse)
  })
  test('remove field from addresses schema successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    schemaImport.removeFieldFromAddressesSchema(schemaResponse)

    expect(schemaResponse).toEqual(expectedSchemaCleanAddress)
  })

  test('remove field from subscription schema successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    schemaImport.removeFieldFromSubscriptionSchema(schemaResponse)
    console.log('cleanedSchema', JSON.stringify(schemaResponse))

    expect(schemaResponse).toEqual(expectedSchemaResponseWithoutFields)
  })

  test('handle error in export schema data', async () => {
    const errorResponse = { errorCode: 1, errorMessage: 'Error' }
    axios.mockResolvedValueOnce({ data: errorResponse })
    const response = await schemaImport.exportSchemaData()
    expect(response).toEqual(errorResponse)
  })

  test('export lite schema data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.exportLiteSchemaData()
    expect(response).toEqual(expectedTransformedLiteCleanedResponsed)
  })
})
