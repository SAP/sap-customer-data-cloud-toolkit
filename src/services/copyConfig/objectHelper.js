export function removePropertyFromObjectCascading(object, property) {
  const propertiesPath = buildPropertiesPath(object)
  propertiesPath.forEach((value) => {
    if (value.includes(property)) {
      deleteProperty(object, value, property)
    }
  })
}

function deleteProperty(object, propertyPath, property) {
  let pointer = object
  propertyPath.split('.').forEach((prop) => {
    if (prop !== property) {
      pointer = pointer[prop]
    } else {
      delete pointer[prop]
      return
    }
  })
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
      return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath)
    }, [])
  }

  return paths(propertiesPath)
}
