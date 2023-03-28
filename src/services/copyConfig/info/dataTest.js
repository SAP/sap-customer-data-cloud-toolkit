import { expectedSchemaResponse } from '../schema/dataTest'
import SchemaOptions from '../schema/schemaOptions'
import PolicyOptions from '../policies/policyOptions'

export function getInfoExpectedResponse(supports) {
  const schemaOptions = new SchemaOptions(undefined)
  const schema = supports ? schemaOptions.getOptions() : schemaOptions.getOptionsDisabled()

  const SCREEN_SET_COLLECTION_DEFAULT = 'Default'
  const screenSets = {
    id: 'screenSets',
    name: 'Screen-Sets',
    value: supports,
    formatName: false,
    branches: [
      {
        id: SCREEN_SET_COLLECTION_DEFAULT,
        name: SCREEN_SET_COLLECTION_DEFAULT,
        value: supports,
        formatName: false,
        branches: [
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-LinkAccounts`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-LinkAccounts`,
            formatName: false,
            value: supports,
          },
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-LiteRegistration`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-LiteRegistration`,
            formatName: false,
            value: supports,
          },
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-OrganizationRegistration`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-OrganizationRegistration`,
            formatName: false,
            value: supports,
          },
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-PasswordlessLogin`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-PasswordlessLogin`,
            formatName: false,
            value: supports,
          },
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-ProfileUpdate`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-ProfileUpdate`,
            formatName: false,
            value: supports,
          },
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-ReAuthentication`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-ReAuthentication`,
            formatName: false,
            value: supports,
          },
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-RegistrationLogin`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-RegistrationLogin`,
            formatName: false,
            value: supports,
          },
          {
            id: `${SCREEN_SET_COLLECTION_DEFAULT}-Subscriptions`,
            name: `${SCREEN_SET_COLLECTION_DEFAULT}-Subscriptions`,
            formatName: false,
            value: supports,
          },
        ],
      },
    ],
  }

  const policiesOptions = new PolicyOptions(undefined)
  const policies = supports ? policiesOptions.getOptions() : policiesOptions.getOptionsDisabled()

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
        id: 'confirmationEmailTemplates',
        name: 'PasswordResetConfirmation',
        value: supports,
      },
      {
        id: 'impossibleTraveler',
        name: 'ImpossibleTraveler',
        value: supports,
      },
      {
        id: 'twoFactorAuth',
        name: 'TFAEmailVerification',
        value: supports,
      },
      {
        //id: 'etPasswordReset',
        id: 'passwordReset',
        name: 'PasswordReset',
        value: supports,
      },
      {
        id: 'doubleOptIn',
        name: 'DoubleOptInConfirmation',
        value: supports,
      },
      {
        id: 'preferencesCenter',
        name: 'LitePreferencesCenter',
        value: supports,
      },
      {
        id: 'accountDeletedEmailTemplates',
        name: 'AccountDeletionConfirmation',
        value: supports,
      },
      {
        id: 'welcomeEmailTemplates',
        name: 'NewUserWelcome',
        value: supports,
      },
      {
        //id: 'etEmailVerification',
        id: 'emailVerification',
        name: 'EmailVerification',
        value: supports,
      },
      {
        //id: 'etCodeVerification',
        id: 'codeVerification',
        name: 'CodeVerification',
        value: supports,
      },
      {
        id: 'magicLink',
        name: 'MagicLink',
        value: supports,
      },
    ],
  }

  const smsTemplates = {
    id: 'smsTemplates',
    name: 'SMS Templates',
    formatName: false,
    value: supports,
  }

  const webSdk = {
    id: 'webSdk',
    name: 'webSdk',
    value: supports,
  }

  const consent = {
    id: 'consent',
    name: 'consentStatements',
    value: supports,
  }
  return [schema, screenSets, policies, socialIdentities, emailTemplates, smsTemplates, webSdk, consent]
}

export function getExpectedSchemaResponseExcept(exceptions) {
  const response = JSON.parse(JSON.stringify(expectedSchemaResponse))
  exceptions.forEach((exception) => {
    delete response[exception]
  })
  return response
}
