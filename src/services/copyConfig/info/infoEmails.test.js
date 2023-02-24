import Info from './info'
import * as CommonTestData from '../../servicesDataTest'
import { getInfoExpectedResponse } from './dataTest'
import axios from 'axios'
import { expectedSchemaResponse } from '../schema/dataTest'
import { getSocialsProviders } from '../social/dataTest'
import { getSmsExpectedResponse } from '../../sms/dataTest'
import { getEmailsExpectedResponse } from '../../emails/dataTest'
import { getSiteConfig } from '../websdk/dataTest'
import { expectedScreenSetResponse } from '../screenset/dataTest'

jest.mock('axios')

describe('Info Email Templates test suite', () => {
  const apiKey = 'apiKey'
  const socialsKeys = 'APP KEY'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')
  let expectedResponse

  beforeEach(() => {
    expectedResponse = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
  })

  test('get emails info successfully except magicLink', async () => {
    await executeInfoEmailsTest(['magicLink'], 0)
  })

  test('get emails info successfully except codeVerification', async () => {
    await executeInfoEmailsTest(['codeVerification'], 1)
  })

  test('get emails info successfully except emailVerification', async () => {
    await executeInfoEmailsTest(['emailVerification'], 2)
  })

  test('get emails info successfully except welcomeEmailTemplates', async () => {
    await executeInfoEmailsTest(['emailNotifications.welcomeEmailTemplates'], 3)
  })

  test('get emails info successfully except accountDeletedEmailTemplates', async () => {
    await executeInfoEmailsTest(['emailNotifications.accountDeletedEmailTemplates'], 4)
  })

  test('get emails info successfully except preferencesCenter', async () => {
    await executeInfoEmailsTest(['preferencesCenter'], 5)
  })

  test('get emails info successfully except doubleOptIn', async () => {
    await executeInfoEmailsTest(['doubleOptIn'], 6)
  })

  test('get emails info successfully except passwordReset', async () => {
    await executeInfoEmailsTest(['passwordReset'], 7)
  })

  test('get emails info successfully except twoFactorAuth', async () => {
    await executeInfoEmailsTest(['twoFactorAuth'], 8)
  })

  test('get emails info successfully except impossibleTraveler', async () => {
    await executeInfoEmailsTest(['impossibleTraveler'], 9)
  })

  test('get emails info successfully except confirmationEmailTemplates', async () => {
    await executeInfoEmailsTest(['emailNotifications.confirmationEmailTemplates'], 10)
  })

  test('get emails info successfully only magicLink', async () => {
    const mockedResponse = getExpectedEmailsResponseExcept([
      'codeVerification',
      'emailVerification',
      'emailNotifications.welcomeEmailTemplates',
      'emailNotifications.accountDeletedEmailTemplates',
      'preferencesCenter',
      'doubleOptIn',
      'passwordReset',
      'twoFactorAuth',
      'impossibleTraveler',
      'emailNotifications.confirmationEmailTemplates',
    ])
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedScreenSetResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
    const response = await info.get()
    expectedResponse[4].branches = expectedResponse[4].branches.splice(0, 1)
    expect(response).toEqual(expectedResponse)
  })

  async function executeInfoEmailsTest(templateNames, templateIndex) {
    const mockedResponse = getExpectedEmailsResponseExcept(templateNames)
    axios
      .mockResolvedValueOnce({ data: expectedSchemaResponse })
      .mockResolvedValueOnce({ data: expectedScreenSetResponse })
      .mockResolvedValueOnce({ data: getSocialsProviders(socialsKeys) })
      .mockResolvedValueOnce({ data: mockedResponse })
      .mockResolvedValueOnce({ data: getSmsExpectedResponse })
      .mockResolvedValueOnce({ data: getSiteConfig })
    const response = await info.get()
    expectedResponse[4].branches.splice(templateIndex, 1)
    expect(response).toEqual(expectedResponse)
  }

  function getExpectedEmailsResponseExcept(exceptions) {
    const response = JSON.parse(JSON.stringify(getEmailsExpectedResponse))
    exceptions.forEach((exception) => {
      const tokens = exception.split('.')
      if (tokens.length === 2) {
        delete response[tokens[0]][tokens[1]]
      } else if (tokens.length === 1) {
        delete response[exception]
      }
    })
    return response
  }
})
