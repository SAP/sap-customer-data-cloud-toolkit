/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import axios from 'axios'
import { credentials } from '../../servicesDataTest'
import SchemaImportFields from './schemaImportFields'
import {
  expectedLiteSchemaResponse,
  expectedSchemaCleanAddress,
  expectedSchemaResponse,
  expectedSchemaResponseCleaned,
  expectedSchemaResponseWithoutFields,
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
    jest.clearAllMocks()
  })

  test('clean schema data successfully', () => {
    const schemaResponse = expectedSchemaResponse
    schemaImport.cleanSchemaData(schemaResponse)
    expect(schemaResponse).toEqual(expectedSchemaResponseCleaned)
  })

  test('remove field from addresses schema successfully', () => {
    const schemaResponse = { ...expectedSchemaResponse }
    delete schemaResponse.statusCode
    delete schemaResponse.statusReason
    delete schemaResponse.time
    delete schemaResponse.callId
    delete schemaResponse.errorCode
    schemaImport.removeFieldFromAddressesSchema(schemaResponse)

    expect(schemaResponse).toEqual(expectedSchemaCleanAddress)
  })

  test('export transformed schema data successfully', async () => {
    expectedSchemaResponse.errorCode = 0
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.exportTransformedSchemaData()
    expect(response).toEqual(transformedSchema)
  })
  test('export schema data successfully', async () => {
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.exportSchemaData()
    expect(response).toEqual(expectedSchemaResponseCleaned)
  })

  test('export lite schema data successfully', async () => {
    expectedSchemaResponse.errorCode = 0
    axios.mockResolvedValueOnce({ data: expectedSchemaResponse })
    const response = await schemaImport.exportLiteSchemaData()
    expect(response).toEqual(expectedLiteSchemaResponse)
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

  test('handle error in export schema data', async () => {
    const errorResponse = { errorCode: 1, errorMessage: 'Error' }
    axios.mockResolvedValueOnce({ data: errorResponse })
    const response = await schemaImport.exportSchemaData()
    expect(response).toEqual(errorResponse)
  })

  test('get schema data with error', async () => {
    const errorResponse = { errorCode: 1, errorMessage: 'Error' }
    axios.mockResolvedValueOnce({ data: errorResponse })
    const response = await schemaImport.getSchema()
    expect(response).toEqual(errorResponse)
  })
})
