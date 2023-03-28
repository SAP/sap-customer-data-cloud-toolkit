import { expectedSchemaResponse } from '../schema/dataTest'
import SchemaOptions from '../schema/schemaOptions'
import PolicyOptions from '../policies/policyOptions'

export function getInfoExpectedResponse(supports) {
  const schemaOptions = new SchemaOptions(undefined)
  const schema = supports ? schemaOptions.getOptions() : schemaOptions.getOptionsDisabled()

  const SCREEN_SET_COLLECTION_DEFAULT = 'Default'
  const screenSets = createScreenSetCollection(SCREEN_SET_COLLECTION_DEFAULT, supports)

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
        id: 'emailVerification',
        name: 'EmailVerification',
        value: supports,
      },
      {
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

function createScreenSet(collection, name, value) {
  return {
    id: `${collection}-${name}`,
    name: `${collection}-${name}`,
    formatName: false,
    value: value,
  }
}

function createScreenSetCollection(collection, value) {
  const screenSets = {
    id: 'screenSets',
    name: 'Screen-Sets',
    value: value,
    formatName: false,
    branches: [
      {
        id: collection,
        name: collection,
        value: value,
        formatName: false,
        branches: [],
      },
    ],
  }
  const screenSetIds = [
    'LinkAccounts',
    'LiteRegistration',
    'OrganizationRegistration',
    'PasswordlessLogin',
    'ProfileUpdate',
    'ReAuthentication',
    'RegistrationLogin',
    'Subscriptions',
  ]

  for (const name of screenSetIds) {
    screenSets.branches[0].branches.push(createScreenSet(collection, name, value))
  }
  return screenSets
}
