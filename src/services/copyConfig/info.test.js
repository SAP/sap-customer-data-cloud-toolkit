import Info from './info'
import * as CommonTestData from '../servicesDataTest'

describe('Info test suite', () => {
  const apiKey = 'apiKey'
  const info = new Info(CommonTestData.credentials, apiKey, 'eu1')

  test('get info successfully', async () => {
    const response = await info.get()
    console.log('response=' + JSON.stringify(response))
    expect(response).toEqual(getInfoExpectedResponse(true))
  })
})

function getInfoExpectedResponse(supports) {
  return {
    schema: {
      data: supports,
      profile: supports,
    },
    screenSets: {
      default: {
        defaultLinkAccounts: supports,
        defaultLiteRegistration: supports,
      },
      custom: {
        customLinkAccounts: supports,
        customLiteRegistration: supports,
      },
    },
    policies: {
      accountOptions: supports,
      codeVerification: supports,
      emailNotifications: supports,
      emailVerification: supports,
      federation: supports,
      webSdk: supports,
      passwordComplexity: supports,
      passwordReset: supports,
      defaultProfilePhotoDimensions: supports,
      registration: supports,
      security: supports,
      twoFactorAuthenticationProviders: supports,
    },
    socialIdentities: supports,
    emailTemplates: {
      magicLink: supports,
      codeVerification: supports,
      emailVerification: supports,
      newUserWelcome: supports,
      accountDeletionConfirmation: supports,
      litePreferencesCenter: supports,
      doubleOptInConfirmation: supports,
      passwordReset: supports,
      tfaEmailVerification: supports,
      impossibleTraveler: supports,
      passwordResetConfirmation: supports,
    },
    smsTemplates: supports,
    dataflows: supports,
  }
}
