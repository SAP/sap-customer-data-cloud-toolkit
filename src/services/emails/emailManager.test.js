import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'

jest.mock('axios')
jest.setTimeout(10000)

describe('Emails Manager test suite', () => {
  const emailManager = new EmailManager(EmailsTestData.credentials)

  test('export', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.export('apiKey')
    console.log(`test.response=${JSON.stringify(emailTemplates)}`)
    expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  })

  test('export with minimum templates', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
    axios.mockResolvedValue(mockedResponse)

    const emailTemplates = await emailManager.export('apiKey')
    console.log(`test.response=${JSON.stringify(emailTemplates)}`)
    expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  })
})
