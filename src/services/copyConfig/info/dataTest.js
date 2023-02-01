import { expectedSchemaResponse } from '../schema/dataTest'

export function getInfoExpectedResponse(supports) {
  const schema = {
    id: 'schema',
    name: 'schema',
    value: supports,
    branches: [
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
    value: supports,
    branches: [
      {
        id: 'default',
        name: 'default',
        value: supports,
        branches: [
          {
            id: 'defaultLinkAccounts',
            name: 'defaultLinkAccounts',
            value: supports,
          },
          {
            id: 'defaultLiteRegistration',
            name: 'defaultLiteRegistration',
            value: supports,
          },
        ],
      },
      {
        id: 'custom',
        name: 'custom',
        value: supports,
        branches: [
          {
            id: 'customLinkAccounts',
            name: 'customLinkAccounts',
            value: supports,
          },
          {
            id: 'customLiteRegistration',
            name: 'customLiteRegistration',
            value: supports,
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
    value: supports,
    branches: [
      {
        id: accountOptions,
        name: accountOptions,
        value: supports,
      },
      {
        id: codeVerification,
        name: codeVerification,
        value: supports,
      },
      {
        id: emailNotifications,
        name: emailNotifications,
        value: supports,
      },
      {
        id: emailVerification,
        name: emailVerification,
        value: supports,
      },
      {
        id: 'federation',
        name: 'federation',
        value: supports,
      },
      {
        id: 'webSdk',
        name: 'webSdk',
        value: supports,
      },
      {
        id: 'passwordComplexity',
        name: 'passwordComplexity',
        value: supports,
      },
      {
        id: passwordReset,
        name: passwordReset,
        value: supports,
      },
      {
        id: 'defaultProfilePhotoDimensions',
        name: 'defaultProfilePhotoDimensions',
        value: supports,
      },
      {
        id: 'registration',
        name: 'registration',
        value: supports,
      },
      {
        id: 'security',
        name: 'security',
        value: supports,
      },
      {
        id: 'twoFactorAuthenticationProviders',
        name: 'twoFactorAuthenticationProviders',
        value: supports,
      },
    ],
  }
  const socialIdentities = {
    id: 'socialIdentities',
    name: 'socialIdentities',
    value: supports,
  }
  const emailTemplates = {
    id: 'emailTemplates',
    name: 'emailTemplates',
    value: supports,
    branches: [
      {
        id: 'magicLink',
        name: 'magicLink',
        value: supports,
      },
      {
        id: 'etCodeVerification',
        name: codeVerification,
        value: supports,
      },
      {
        id: 'etEmailVerification',
        name: emailVerification,
        value: supports,
      },
      {
        id: 'newUserWelcome',
        name: 'newUserWelcome',
        value: supports,
      },
      {
        id: 'accountDeletionConfirmation',
        name: 'accountDeletionConfirmation',
        value: supports,
      },
      {
        id: 'litePreferencesCenter',
        name: 'litePreferencesCenter',
        value: supports,
      },
      {
        id: 'doubleOptInConfirmation',
        name: 'doubleOptInConfirmation',
        value: supports,
      },
      {
        id: 'etPasswordReset',
        name: passwordReset,
        value: supports,
      },
      {
        id: 'tfaEmailVerification',
        name: 'tfaEmailVerification',
        value: supports,
      },
      {
        id: 'impossibleTraveler',
        name: 'impossibleTraveler',
        value: supports,
      },
      {
        id: 'passwordResetConfirmation',
        name: 'passwordResetConfirmation',
        value: supports,
      },
    ],
  }
  const smsTemplates = {
    id: 'smsTemplates',
    name: 'smsTemplates',
    value: supports,
  }
  const dataflows = {
    id: 'dataflows',
    name: 'dataflows',
    value: supports,
  }
  return [schema, screenSets, policies, socialIdentities, emailTemplates, smsTemplates, dataflows]
}

export function getExpectedSchemaResponseExcept(exceptions) {
  const response = JSON.parse(JSON.stringify(expectedSchemaResponse))
  exceptions.forEach((exception) => {
    delete response[exception]
  })
  return response
}
