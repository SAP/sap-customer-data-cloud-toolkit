import { addPreferencesBranches } from './preferencesImport/aditionalStructure/preferencesAditionalBranches'

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
  console.log('fieldsTransformed', fieldsTransformed)
  return fieldsTransformed
}

function transformField(key, value) {
  // if (value.fields) {
  //   return {
  //     id: key,
  //     name: key.replace('Schema', ''),
  //     value: false,
  //     branches: transformSchema(value.fields, key),
  //   }
  // }
  // if (key === 'preferences') {
  //   return {
  //     id: key,
  //     name: 'consent statements',
  //     value: false,
  //     branches: transformSchema(value, key),
  //   }
  // }
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

  Object.values(communications).forEach((item, index) => {
    const unique_id = `${item.topic}.${item.topicChannelId}`
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

function transformSubscriptions(splitKeys, currentLevel) {
  const id = splitKeys.join('.')
  let existing = currentLevel.find((item) => item.id === id)
  if (!existing) {
    existing = {
      id: id,
      name: id,
      value: false,
      branches: [],
    }
    currentLevel.push(existing)
  }
  return existing
}
function transformAddresses(splitKeys, currentLevel) {
  for (let index = 0; index < splitKeys.length; index++) {
    let id
    if (index === 0) {
      id = splitKeys[index] // First level id
    } else {
      id = splitKeys.slice(0, index + 1).join('.') // Subsequent levels id
    }

    let existing = currentLevel.find((item) => item.id === id)
    if (!existing) {
      existing = {
        id: id,
        name: id,
        value: false,
        branches: [],
      }
      currentLevel.push(existing)
    }
    currentLevel = existing.branches
  }
  return currentLevel
}
function transformSchema(fields, parentKey, skipFields = true) {
  const transformedSchema = []
  for (let key in fields) {
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformedSchema
      console.log('splitKeys', splitKeys)
      // // if (parentKey === 'subscriptionsSchema' && splitKeys.length > 1) {
      // //   const existing = transformSubscriptions(splitKeys, currentLevel)
      // //   if (isFieldDetailObject(fieldDetail, parentKey, skipFields) && hasNestedObject(fieldDetail)) {
      // //     existing.branches = transformSchema(fieldDetail, parentKey, skipFields)
      // //   }
      // //   continue
      // // }

      // if (parentKey === 'addressSchema' && splitKeys.length > 1) {
      //   currentLevel = transformAddresses(splitKeys, currentLevel)
      //   continue
      // }
      splitKeys.forEach((part, index) => {
        let id

        if (parentKey === 'preferences') {
          id = splitKeys.slice(0, index + 1).join('.')
        } else {
          id = `${part}.${parentKey}`
        }
        let existing = currentLevel.find((item) => item.id === id)
        if (!existing) {
          existing = {
            id: id,
            name: part,
            value: false,
            branches: [],
          }
          currentLevel.push(existing)
        }

        if (index === splitKeys.length - 1) {
          if (isFieldDetailObject(fieldDetail, skipFields) && hasNestedObject(fieldDetail)) {
            existing.branches = transformSchema(fieldDetail, parentKey, skipFields)
          }
          if (parentKey === 'preferences') {
            addPreferencesBranches(existing.branches, existing.id)
          }
        } else {
          currentLevel = existing.branches
        }
      })
    }
  }
  return transformedSchema
}
export function isFieldDetailObject(fieldDetail, skipFields = true) {
  if (fieldDetail && typeof fieldDetail === 'object') {
    const stopFields = ['required', 'type', 'allowNull', 'writeAccess', 'tags']
    return skipFields ? !stopFields.some((field) => field in fieldDetail) : true
  }
  return false
}
