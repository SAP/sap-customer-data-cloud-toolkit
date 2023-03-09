import { expectedSchemaResponse } from '../schema/dataTest'
import EmailOptions from '../emails/emailOptions'
import SchemaOptions from '../schema/schemaOptions'
import ScreenSetOptions from '../screenset/screensetOptions'

export function getInfoExpectedResponse(supports) {
  const schemaOptions = new SchemaOptions(undefined)
  const schema = supports ? schemaOptions.getOptions() : schemaOptions.getOptionsDisabled()

  const screenSetOptions = new ScreenSetOptions(undefined)
  const screenSets = supports ? screenSetOptions.getOptions() : screenSetOptions.getOptionsDisabled()

  const accountOptions = 'accountOptions'
  const codeVerification = 'codeVerification'
  const emailNotification = 'emailNotifications'
  const gigyaPlugins = 'Web Sdk'
  const emailVerification = 'emailVerification'
  const federation = 'federation'
  const passwordComplexity = 'passwordComplexity'
  const passwordReset = 'passwordReset'
  const profilePhoto = 'profilePhoto'
  const registration = 'registration'
  const security = 'security'
  const twoFactorAuth = 'twoFactorAuth'
  const policies = {
    id: 'policy',
    name: 'policy',
    value: supports,
    tooltip: 'POLICIES',
    branches: [
      {
        id: accountOptions,
        name: 'AccountOptions',
        value: supports,
        tooltip: 'POLICIES_ACCOUNT_OPTIONS',
      },
      {
        id: codeVerification,
        name: 'CodeVerification',
        value: supports,
        tooltip: 'CODE_VERIFICATION',
      },
      {
        id: emailNotification,
        name: 'EmailNotifications',
        value: supports,

        tooltip: 'POLICIES_EMAIL_NOTIFICATIONS',
      },
      {
        id: emailVerification,
        name: 'EmailVerification',
        value: supports,

        tooltip: 'POLICIES_EMAIL_VERIFICATION',
      },
      {
        id: federation,
        name: 'Federation',
        value: supports,

        tooltip: 'POLICIES_FEDERATION',
      },

      {
        id: passwordComplexity,
        name: 'PasswordComplexity',
        value: supports,

        tooltip: 'POLICIES_PASSWORD_COMPLEXITY',
      },
      {
        id: 'gigyaPlugins',
        name: gigyaPlugins,
        value: supports,

        tooltip: 'POLICIES_WEBSDK',
      },
      {
        id: passwordReset,
        name: 'passwordReset',
        value: supports,
        tooltip: 'POLICIES_PASSWORD_RESET',
      },
      {
        id: profilePhoto,
        name: 'profilePhoto',
        value: supports,
        tooltip: 'POLICIES_DEFAULT_PROFILE_PHOTO_DIMENSIONS',
      },
      {
        id: registration,
        name: 'Registration',
        value: supports,
        tooltip: 'POLICIES_REGISTRATION',
      },
      {
        id: security,
        name: 'Security',
        value: supports,
        tooltip: 'POLICIES_SECURITY',
      },
      {
        id: twoFactorAuth,
        name: 'TwoFactorAuth',
        value: supports,
        tooltip: 'POLICIES_TWO_FACTOR_AUTHENTICATION_PROVIDERS',
      },
    ],
  }
  const socialIdentities = {
    id: 'socialIdentities',
    name: 'socialIdentities',
    value: supports,
  }

  const emailOptions = new EmailOptions(undefined)
  const emailTemplates = supports ? emailOptions.getOptions() : emailOptions.getOptionsDisabled()

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

  const webSdk = {
    id: 'webSdk',
    name: 'webSdk',
    value: supports,
  }
  return [schema, screenSets, policies, socialIdentities, emailTemplates, smsTemplates, dataflows, webSdk]
}

export function getExpectedSchemaResponseExcept(exceptions) {
  const response = JSON.parse(JSON.stringify(expectedSchemaResponse))
  exceptions.forEach((exception) => {
    delete response[exception]
  })
  return response
}
