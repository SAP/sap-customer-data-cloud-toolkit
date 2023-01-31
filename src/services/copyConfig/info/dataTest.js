import { expectedSchemaResponse } from '../schema/dataTest'

export function getInfoExpectedResponse(supports) {
  const schema = {
    id: 'schema',
    name: 'schema',
    value: [
      {
        id: 'dataSchema',
        name: 'dataSchema',
        value: supports,
      },
      {
        id: 'profileSchema',
        name: 'profileSchema',
        value: supports,
      },
    ],
  }
  const screenSets = {
    id: 'screenSets',
    name: 'screenSets',
    value: [
      {
        id: 'default',
        name: 'default',
        value: [
          {
            id: 'defaultLinkAccounts',
            name: 'defaultLinkAccounts',
            value: false,
          },
          {
            id: 'defaultLiteRegistration',
            name: 'defaultLiteRegistration',
            value: false,
          },
        ],
      },
      {
        id: 'custom',
        name: 'custom',
        value: [
          {
            id: 'customLinkAccounts',
            name: 'customLinkAccounts',
            value: false,
          },
          {
            id: 'customLiteRegistration',
            name: 'customLiteRegistration',
            value: false,
          },
        ],
      },
    ],
  }
  const accountOptions = 'accountOptions'
  const codeVerification = 'codeVerification'
  const emailNotifications = 'emailNotifications'
  const emailVerification = 'emailVerification'
  const passwordReset = 'passwordReset'
  const policies = {
    id: 'policies',
    name: 'policies',
    value: [
      {
        id: accountOptions,
        name: accountOptions,
        value: false,
      },
      {
        id: codeVerification,
        name: codeVerification,
        value: false,
      },
      {
        id: emailNotifications,
        name: emailNotifications,
        value: false,
      },
      {
        id: emailVerification,
        name: emailVerification,
        value: false,
      },
      {
        id: 'federation',
        name: 'federation',
        value: false,
      },
      {
        id: 'webSdk',
        name: 'webSdk',
        value: false,
      },
      {
        id: 'passwordComplexity',
        name: 'passwordComplexity',
        value: false,
      },
      {
        id: passwordReset,
        name: passwordReset,
        value: false,
      },
      {
        id: 'defaultProfilePhotoDimensions',
        name: 'defaultProfilePhotoDimensions',
        value: false,
      },
      {
        id: 'registration',
        name: 'registration',
        value: false,
      },
      {
        id: 'security',
        name: 'security',
        value: false,
      },
      {
        id: 'twoFactorAuthenticationProviders',
        name: 'twoFactorAuthenticationProviders',
        value: false,
      },
    ],
  }
  const socialIdentities = {
    id: 'socialIdentities',
    name: 'socialIdentities',
    value: false,
  }
  const emailTemplates = {
    id: 'emailTemplates',
    name: 'emailTemplates',
    value: [
      {
        id: 'magicLink',
        name: 'magicLink',
        value: false,
      },
      {
        id: 'etCodeVerification',
        name: codeVerification,
        value: false,
      },
      {
        id: 'etEmailVerification',
        name: emailVerification,
        value: false,
      },
      {
        id: 'newUserWelcome',
        name: 'newUserWelcome',
        value: false,
      },
      {
        id: 'accountDeletionConfirmation',
        name: 'accountDeletionConfirmation',
        value: false,
      },
      {
        id: 'litePreferencesCenter',
        name: 'litePreferencesCenter',
        value: false,
      },
      {
        id: 'doubleOptInConfirmation',
        name: 'doubleOptInConfirmation',
        value: false,
      },
      {
        id: 'etPasswordReset',
        name: passwordReset,
        value: false,
      },
      {
        id: 'tfaEmailVerification',
        name: 'tfaEmailVerification',
        value: false,
      },
      {
        id: 'impossibleTraveler',
        name: 'impossibleTraveler',
        value: false,
      },
      {
        id: 'passwordResetConfirmation',
        name: 'passwordResetConfirmation',
        value: false,
      },
    ],
  }
  const smsTemplates = {
    id: 'smsTemplates',
    name: 'smsTemplates',
    value: false,
  }
  const dataflows = {
    id: 'dataflows',
    name: 'dataflows',
    value: false,
  }
  return [
    schema,
    screenSets,
    policies,
    socialIdentities,
    emailTemplates,
    smsTemplates,
    dataflows,
  ]
}

export function getExpectedSchemaResponseExcept(exceptions) {
  const response = JSON.parse(JSON.stringify(expectedSchemaResponse))
  exceptions.forEach((exception) => {
    delete response[exception]
  })
  return response
}
