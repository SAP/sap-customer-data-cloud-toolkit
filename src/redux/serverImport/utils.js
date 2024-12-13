export const getConfigurationByKey = (structure, key) => {
  return structure[key]
}
export const addProperty = (option, accountType) => {
  option.forEach((item) => {
    item.accountType = accountType
  })
}

export const removeValueIfExists = (configurations) => {
  configurations.forEach((config) => {
    if (config.value) {
      delete config.value
    }
  })
}

export const clearAllValues = (structure) => {
  Object.keys(structure).forEach((key) => {
    removeValueIfExists(structure[key])
  })
}
