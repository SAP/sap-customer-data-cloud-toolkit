import { expectedSchemaResponse } from '../schema/dataTest'
import EmailOptions from '../emails/emailOptions'
import SchemaOptions from '../schema/schemaOptions'
import ScreenSetOptions from '../screenset/screensetOptions'
import PolicyOptions from '../policies/policyOptions'

export function getInfoExpectedResponse(supports) {
  const schemaOptions = new SchemaOptions(undefined)
  const schema = supports ? schemaOptions.getOptions() : schemaOptions.getOptionsDisabled()

  const screenSetOptions = new ScreenSetOptions(undefined)
  const screenSets = supports ? screenSetOptions.getOptions() : screenSetOptions.getOptionsDisabled()

  const policiesOptions = new PolicyOptions(undefined)
  const policies = supports ? policiesOptions.getOptions() : policiesOptions.getOptionsDisabled()

  const socialIdentities = {
    id: 'socialIdentities',
    name: 'socialIdentities',
    value: supports,
  }

  const emailOptions = new EmailOptions(undefined)
  const emailTemplates = supports ? emailOptions.getOptions() : emailOptions.getOptionsDisabled()

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
