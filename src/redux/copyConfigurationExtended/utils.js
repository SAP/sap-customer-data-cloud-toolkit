import { getApiKey } from '../utils'

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

const clearConfigurationErrors = (configuration) => {
  configuration.error = undefined
  if (configuration.branches) {
    for (const branch of configuration.branches) {
      if (branch.error) {
        branch.error = undefined
      }
      clearConfigurationErrors(branch)
    }
  }
}

export const clearConfigurationsErrors = (configurations) => {
  for (const configuration of configurations) {
    clearConfigurationErrors(configuration)
  }
}

export const clearTargetSitesErrors = (targetSites) => {
  targetSites.forEach((targetSite) => {
    if (targetSite.error) {
      targetSite.error = undefined
    }
  })
}

export const addErrorToConfigurations = (configurations, errors) => {
  for (const error of errors) {
    const configuration = findConfiguration(configurations, error.context.id)
    if (configuration) {
      configuration.error = error
    }
  }
  spreadErrors(configurations)
}

export const addErrorToTargetApiKey = (targetSites, errors) => {
  for (const targetSite of targetSites) {
    const targetApiKeyErrors = errors.filter((error) => error.context.targetApiKey === targetSite.apiKey)
    if (targetApiKeyErrors.length !== 0) {
      targetSite.error = targetApiKeyErrors
    }
  }
}

const spreadErrors = (configurations) => {
  for (const configuration of configurations) {
    const err = getRootErrors(configuration)
    if (err && err.length !== 0) {
      configuration.error = err
    }
  }
}

const getRootErrors = (configuration) => {
  if (configuration.branches) {
    if (branchHasErrors(configuration.branches)) {
      return mergeBranchErrors(configuration.branches)
    } else {
      let rootErrors = []
      for (const branch of configuration.branches) {
        const branchErrors = getRootErrors(branch)
        if (branchErrors && branchErrors.length !== 0) {
          rootErrors.push(branchErrors)
          branch.error = branchErrors
        }
      }
      return rootErrors.flat()
    }
  }
}

const mergeBranchErrors = (branch) => {
  const brancErrors = branch.filter((configuration) => configuration.error !== undefined).map((configuration) => configuration.error)
  return brancErrors.length !== 0 ? brancErrors : undefined
}

const branchHasErrors = (branch) => {
  return branch.find((configuration) => configuration.error !== undefined) !== undefined
}

export const isTargetSiteDuplicated = (apiKey, targetSites) => {
  return targetSites.filter((targetSite) => targetSite.apiKey === apiKey)[0] !== undefined
}

export const sourceEqualsTarget = (sourceApiKey) => {
  return sourceApiKey === getApiKey(window.location.hash)
}
