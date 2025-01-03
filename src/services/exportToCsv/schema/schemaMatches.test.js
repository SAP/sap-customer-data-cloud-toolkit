import { expectedOptions, expectedSchemaResult } from './dataTest'
import { exportSchemaData } from './schemaMatches'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Export schema Data', () => {
    const schemaData = exportSchemaData(expectedOptions)
    expect(schemaData).toEqual(expectedSchemaResult)
  })
})
