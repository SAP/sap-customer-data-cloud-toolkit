export async function exportToCSV(items, combinedData) {
  const options = getOptionsFromTree(items)
  const valueToCsv = []

  for (let key of options) {
    if (key !== 'subscriptionsSchema') {
      let value = findValueByKeyInCombinedData(combinedData, key)
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value).replace(/"/g, '""')
      }

      valueToCsv.push(value)
    }
  }
  const keys = matchKeys(combinedData, options)
  createCSVFile(keys)
}

const matchKeys = (schema, matchArray) => {
  const resultKeys = []

  const findMatches = (obj, parentKey = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key

      const keySegments = fullKey.split('.')
      const lastSegment = keySegments[keySegments.length - 1]

      if (matchArray.includes(lastSegment)) {
        resultKeys.push(fullKey)
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        findMatches(value, fullKey)
      }
    })
  }
  findMatches(schema)

  return resultKeys
}
function createCSVFile(resultKeys) {
  const removeFields = resultKeys.map((item) => {
    return item.replace('.fields', '').replace('Schema', '')
  })
  const csvData = new Blob([removeFields], { type: 'text/csv' })
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = `csv_File.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
function valueToCSV(headers, value) {
  // const csvValues = value.map((value) => {
  //   if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
  //     return `"${value}"`
  //   }
  //   return value
  // })
  const importAccountsData = [headers]

  const csvData = new Blob([importAccountsData], { type: 'text/csv' })
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = `csv_File.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
