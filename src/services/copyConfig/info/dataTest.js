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
        name: 'MagicLink',
        value: supports,
      },
      {
        id: 'etCodeVerification',
        name: 'CodeVerification',
        value: supports,
      },
      {
        id: 'etEmailVerification',
        name: 'EmailVerification',
        value: supports,
      },
      {
        id: 'newUserWelcome',
        name: 'NewUserWelcome',
        value: supports,
      },
      {
        id: 'accountDeletionConfirmation',
        name: 'AccountDeletionConfirmation',
        value: supports,
      },
      {
        id: 'litePreferencesCenter',
        name: 'LitePreferencesCenter',
        value: supports,
      },
      {
        id: 'doubleOptInConfirmation',
        name: 'DoubleOptInConfirmation',
        value: supports,
      },
      {
        id: 'etPasswordReset',
        name: 'PasswordReset',
        value: supports,
      },
      {
        id: 'tfaEmailVerification',
        name: 'TFAEmailVerification',
        value: supports,
      },
      {
        id: 'impossibleTraveler',
        name: 'ImpossibleTraveler',
        value: supports,
      },
      {
        id: 'passwordResetConfirmation',
        name: 'PasswordResetConfirmation',
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
