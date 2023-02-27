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
