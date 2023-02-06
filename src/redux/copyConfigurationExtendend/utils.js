export const findConfiguration = (configurations, checkBoxId) => {
  for (const configuration of configurations) {
    if (configuration.id === checkBoxId) {
      return configuration
    }
    if (configuration.branches) {
      const foundConfiguration = findConfiguration(configuration.branches, checkBoxId)
      if (foundConfiguration) {
        return foundConfiguration
      }
    }
  }
  return undefined
}

export const propagateConfigurationState = (configuration, value) => {
  configuration.value = value
  if (configuration.branches) {
    configuration.branches.forEach((branch) => {
      branch.value = value
      propagateConfigurationState(branch, value)
    })
  }
}
