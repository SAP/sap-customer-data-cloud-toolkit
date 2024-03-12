/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export function getResponseWithContext(response, id, apiKey) {
  const resp = JSON.parse(JSON.stringify(response))
  resp.context = JSON.stringify({ targetApiKey: apiKey, id: id })
  return resp
}

export function getExpectedResponseWithContext(response, id, apiKey) {
  const resp = JSON.parse(JSON.stringify(response))
  resp.context = { targetApiKey: apiKey, id: id }
  return resp
}

export function getExpectedResponseWithContextAsString(response, id, apiKey) {
  const resp = getExpectedResponseWithContext(response, id, apiKey)
  resp.context = JSON.stringify(resp.context)
  return resp
}

export const schemaId = 'dataSchema'
export const profileId = 'profileSchema'
export const subscriptionsId = 'subscriptionsSchema'
export const internalSchemaId = 'internalSchema'
export const addressesSchemaId = 'addressesSchema'
export const socialIdentitiesId = 'socialIdentities'
export const smsTemplatesId = 'smsTemplates'
export const emailTemplatesId = 'emailTemplates'
export const webSdkId = 'webSdk'
export const policyId = 'policy'
export const consentId = 'consent'
export const channelId = 'communication_channel'
export const topicId = 'communication_topic'
export const rbaRiskAssessmentId = 'rba.riskAssessment'
export const rbaUnknownLocationNotificationId = 'rba.unknownLocationNotification'
export const rbaPolicyId = 'rba.policy'
