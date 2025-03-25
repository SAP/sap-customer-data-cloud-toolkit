/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { communicationFieldId, communicationMandatoryFieldId, extractAndTransformFields } from '../utils'

export function extractAndTransformCommunicationFields(communicationData) {
  return extractAndTransformFields(communicationData, transformField)
}
function transformField(key, value) {
  if (key === communicationFieldId) {
    return transformCommunications(value, communicationFieldId)
  }

  return null
}
function transformCommunications(communications, parentKey) {
  const result = {
    id: communicationFieldId,
    name: communicationFieldId,
    value: false,
    branches: [],
  }

  const channels = {}

  Object.values(communications).forEach((item) => {
    if (!channels[item.topicChannelId]) {
      channels[item.topicChannelId] = {
        id: `${parentKey}.${item.topicChannelId}`,
        name: item.topicChannelId,
        value: false,
        branches: [],
      }
    }

    const statusBranch = {
      id: `${parentKey}.${item.topicChannelId}.${communicationMandatoryFieldId}`,
      name: communicationMandatoryFieldId,
      value: false,
      branches: [],
    }

    channels[item.topicChannelId].branches.push(statusBranch)
    if (item.schema && item.schema.properties && item.schema.properties.optIn) {
      const optInProperties = item.schema.properties.optIn.properties
      const optInBranches = Object.keys(optInProperties).map((key) => ({
        id: `${parentKey}.${item.topicChannelId}.optIn.${key}`,
        name: key,
        value: false,
        branches: [],
      }))
      channels[item.topicChannelId].branches.push(...optInBranches)
    }
  })
  result.branches = Object.values(channels)
  return result
}
