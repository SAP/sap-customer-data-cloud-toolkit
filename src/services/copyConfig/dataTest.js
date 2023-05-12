/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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

export const schemaId = 'dataSchema'
export const profileId = 'profileSchema'
export const subscriptionsId = 'subscriptionsSchema'
export const socialIdentitiesId = 'socialIdentities'
export const smsTemplatesId = 'smsTemplates'
export const emailTemplatesId = 'emailTemplates'
export const webSdkId = 'webSdk'
export const policyId = 'policy'
export const consentId = 'consent'
export const channelId = 'communication_channel'
export const topicId = 'communication_topic'
