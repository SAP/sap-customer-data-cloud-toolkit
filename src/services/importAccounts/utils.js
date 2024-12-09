export function extractAndTransformFields(combinedData) {
  const fieldsTransformed = []
  Object.entries(combinedData).forEach(([key, value]) => {
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
    const transformedCommunications = transformCommunications(value)
    console.log(JSON.stringify(transformedCommunications, null, 2))
    return transformedCommunications
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

  Object.values(communications).forEach((item) => {
    if (!channels[item.channel]) {
      channels[item.channel] = {
        id: item.topicChannelId,
        name: item.topicChannelId,
        value: false,
        branches: [],
      }
    }
    const statusBranch = {
      id: `status.${item.topicChannelId}`,
      name: 'status',
      value: false,
      branches: [],
    }

    channels[item.channel].branches = [statusBranch]
    if (item.schema && item.schema.properties && item.schema.properties.optIn) {
      const optInProperties = item.schema.properties.optIn.properties
      const optInBranches = Object.keys(optInProperties).map((key) => ({
        id: `${key}.${item.topicChannelId}`,
        name: key,
        value: false,
        branches: [],
      }))
      channels[item.channel].branches.push(...optInBranches)
    }
  })

  result.branches = Object.values(channels)
  return result
}
export function hasNestedObject(field) {
  for (let key in field) {
    if (typeof field[key] === 'object' && field[key] !== null) {
      return true
    }
  }
  return false
}

export function isFieldDetailObject(fieldDetail, skipFields = true) {
  if (fieldDetail && typeof fieldDetail === 'object') {
    const stopFields = ['required', 'type', 'allowNull', 'writeAccess', 'tags']
    return skipFields ? !stopFields.some((field) => field in fieldDetail) : true
  }
  return false
}
