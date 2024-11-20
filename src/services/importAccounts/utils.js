import { addPreferencesBranches } from './preferencesImport/preferencesAditionalBranches'

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
  if (value.fields) {
    return {
      id: key,
      name: key.replace('Schema', ''),
      value: false,
      branches: transformSchema(value.fields, key),
    }
  }
  if (key === 'preferences') {
    return {
      id: key,
      name: 'consent statements',
      value: false,
      branches: transformSchema(value, key),
    }
  }
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
    const topicBranch = {
      id: unique_id,
      name: item.topic,
      value: false,
      branches: [],
    }
    topicBranch.branches = [statusBranch]
    if (item.schema && item.schema.properties && item.schema.properties.optIn) {
      const optInProperties = item.schema.properties.optIn.properties
      const optInBranches = Object.keys(optInProperties).map((key) => ({
        id: `${key}.${item.topicChannelId}`,
        name: key,
        value: false,
        branches: [],
      }))
      topicBranch.branches.push(...optInBranches)
    }

    channels[item.channel].branches.push(topicBranch)
  })

  result.branches = Object.values(channels)
  return result
}
function hasNestedObject(field) {
  for (let key in field) {
    if (typeof field[key] === 'object' && field[key] !== null) {
      return true
    }
  }
  return false
}
//   addPreferencesBranches(branches, parentId) {
//     const additionalBranches = [
//       { id: `${parentId}.isConsentGranted`, name: 'isConsentGranted', value: false, branches: [] },
//       { id: `${parentId}.actionTimestamp`, name: 'actionTimestamp', value: false, branches: [] },
//       { id: `${parentId}.lastConsentModified`, name: 'lastConsentModified', value: false, branches: [] },
//       { id: `${parentId}.docVersion`, name: 'docVersion', value: false, branches: [] },
//       { id: `${parentId}.docDate`, name: 'docDate', value: false, branches: [] },
//       { id: `${parentId}.tags`, name: 'tags', value: false, branches: [] },
//       { id: `${parentId}.entitlements`, name: 'entitlements', value: false, branches: [] },
//     ]

//     branches.push(...additionalBranches)
//   }
//   addCommunitacionBranches(branches, parentId) {
//     const additionalBranches = [
//       { id: `${parentId}.status`, name: 'isConsentGranted', value: false, branches: [] },
//       { id: `${parentId}.optIn.brand `, name: 'actionTimestamp', value: false, branches: [] },
//       { id: `${parentId}.lastConsentModified`, name: 'lastConsentModified', value: false, branches: [] },
//       { id: `${parentId}.docVersion`, name: 'docVersion', value: false, branches: [] },
//       { id: `${parentId}.docDate`, name: 'docDate', value: false, branches: [] },
//       { id: `${parentId}.tags`, name: 'tags', value: false, branches: [] },
//       { id: `${parentId}.entitlements`, name: 'entitlements', value: false, branches: [] },
//     ]

//     branches.push(...additionalBranches)
//   }
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
function transformSchema(fields, parentKey, skipFields = true) {
  const transformedSchema = []
  for (let key in fields) {
    if (fields.hasOwnProperty(key)) {
      const fieldDetail = fields[key]
      const splitKeys = key.split('.')
      let currentLevel = transformedSchema
      console.log('splitKeys', splitKeys)
      if (parentKey === 'subscriptionsSchema' && splitKeys.length > 1) {
        const existing = transformSubscriptions(splitKeys, currentLevel)
        if (isFieldDetailObject(fieldDetail, parentKey, skipFields) && hasNestedObject(fieldDetail)) {
          existing.branches = transformSchema(fieldDetail, parentKey, skipFields)
        }
        continue
      }

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
          if (isFieldDetailObject(fieldDetail, parentKey, skipFields) && hasNestedObject(fieldDetail)) {
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
function isFieldDetailObject(fieldDetail, parentKey, skipFields = true) {
  if (fieldDetail && typeof fieldDetail === 'object') {
    const stopFields = ['required', 'type', 'allowNull', 'writeAccess', 'tags']
    return skipFields ? !stopFields.some((field) => field in fieldDetail) : true
  }
  return false
}

function getOptionsFromTree(items) {
  let ids = []
  items.forEach((item) => {
    if (item.value === true) {
      ids.push(item.id)
    }
    if (item.branches && item.branches.length > 0) {
      ids = ids.concat(getOptionsFromTree(item.branches))
    }
  })

  return ids
}
function getValueByKey(obj, key) {
  return obj[key]
}
function findValueByKeyInCombinedData(data, key) {
  if (data == null || typeof data !== 'object') {
    return null
  }

  if (data.hasOwnProperty(key)) {
    return data[key]
  }

  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      let result = findValueByKeyInCombinedData(data[prop], key)
      if (result !== null) {
        return result
      }
    }
  }

  return null
}
