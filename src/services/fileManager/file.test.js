import File from '../fileManager/file'
import * as EmailsTestData from '../emails/data_test'
jest.mock('axios')
jest.setTimeout(10000)

describe('files test suite', () => {
  test('create temo dir', async () => {
    let file = new File()
    file.createFile('passwordReset', 'es', EmailsTestData.emailTemplate)
  })
})
