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
  console.log('fieldsTransformed', fieldsTransformed)
  return fieldsTransformed
}
function transformField(key, value) {
  if (key === 'communications') {
    return transformCommunications(value)
  }

  return null
}
function transformCommunications(communications) {
  const result = {
    id: 'communications',
    name: 'communications',
    value: false,
    branches: [],
  }

  const channels = {}

  Object.values(communications).forEach((item, index) => {
    if (!channels[item.channel]) {
      channels[item.channel] = {
        id: item.topicChannelId,
        name: item.topicChannelId,
        value: false,
        branches: [],
      }
    }
    const statusBranch = {
      id: `${item.topicChannelId}.status`,
      name: 'status',
      value: false,
      branches: [],
    }

    channels[item.channel].branches = [statusBranch]
    if (item.schema && item.schema.properties && item.schema.properties.optIn) {
      const optInProperties = item.schema.properties.optIn.properties
      const optInBranches = Object.keys(optInProperties).map((key) => ({
        id: `${item.topicChannelId}.optIn.${key}`,
        name: key,
        value: false,
        branches: [],
      }))
      console.log('id...>', `${item.topicChannelId}`)
      console.log('optInBranches', optInBranches)
      channels[item.channel].branches.push(...optInBranches)
    }
  })

  result.branches = Object.values(channels)
  return result
}
