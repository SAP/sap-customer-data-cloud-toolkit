export function removePropertyFromObjectCascading(object, property) {
  const deletedProperties = []
  const propertiesPath = buildPropertiesPath(object)
  propertiesPath.forEach((value) => {
    if (
      value.includes(property) &&
      !deletedProperties.find((str) => {
        return value.startsWith(str)
      })
    ) {
      const deletedPath = deleteProperty(object, value, property)
      if (deletedPath) {
        deletedProperties.push(deletedPath)
      }
    }
  })
}

function deleteProperty(object, propertyPath, property) {
  let pointer = object
  const tokens = propertyPath.split('.')
  for (const token of tokens) {
    if (token !== property) {
      pointer = pointer[token]
    } else {
      delete pointer[token]
      const idx = propertyPath.search(property)
      return propertyPath.substring(0, idx + property.length)
    }
  }
  return undefined
}

function buildPropertiesPath(propertiesPath) {
  const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val)

  const addDelimiter = (a, b) => (a ? `${a}.${b}` : b)

  const paths = (obj = {}, head = '') => {
    if (!isObject(obj)) {
      return []
    }
    return Object.entries(obj).reduce((product, [key, value]) => {
      const fullPath = addDelimiter(head, key)
      return isObject(value) && Object.keys(value).length !== 0 ? product.concat(paths(value, fullPath)) : product.concat(fullPath)
    }, [])
  }

  return paths(propertiesPath)
}

export function stringToJson(obj, property) {
  if (Array.isArray(obj)) {
    for (const instance of obj) {
      if(typeof instance[property] === 'string') {
        instance[property] = JSON.parse(instance[property])
      }
    }
  } else {
    if(typeof obj[property] === 'string') {
      obj[property] = JSON.parse(obj[property])
    }
  }
}