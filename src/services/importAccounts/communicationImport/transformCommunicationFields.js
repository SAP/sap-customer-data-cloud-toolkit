export function extractAndTransformCommunicationFields(communicationData) {
  const fieldsTransformed = []
  Object.entries(communicationData).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      const transformed = transformField(key, value)
      if (transformed) {
        fieldsTransformed.push(transformed)
      }
    }
  })
  return fieldsTransformed
}
function transformField(key, value) {
  if (key === 'communications') {
    return transformCommunications(value, 'communications')
  }

  return null
}
function transformCommunications(communications, parentKey) {
  const result = {
    id: 'communications',
    name: 'communications',
    value: false,
    branches: [],
  }

  const channels = {}

  Object.values(communications).forEach((item) => {
    if (!channels[item.topicChannelId]) {
      channels[item.topicChannelId] = {
        id: item.topicChannelId,
        name: item.topicChannelId,
        value: false,
        branches: [],
      }
    }

    const statusBranch = {
      id: `${parentKey}.${item.topicChannelId}.status`,
      name: 'status',
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
