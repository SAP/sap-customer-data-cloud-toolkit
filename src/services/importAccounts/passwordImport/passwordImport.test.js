import { passwordImportTreeFields } from './passwordImport'
import { expectedPasswordResponse } from './dataTest'
jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - PasswordImport test suite', () => {
  test('export password data successfully', async () => {
    const passwordTree = passwordImportTreeFields()
    expect(passwordTree).toEqual(expectedPasswordResponse)
  })
})
