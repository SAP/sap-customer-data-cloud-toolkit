import { expectedPasswordObject, expectedPasswordResponse } from './dataTest'
import { exportPasswordData } from './passwordMatches'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - SchemaImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('Export schema Data', () => {
    const passwordData = exportPasswordData(expectedPasswordObject)
    expect(passwordData).toEqual(expectedPasswordResponse)
  })
})
