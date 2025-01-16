/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
const mandatoryFields = ['isSubscribed', 'isConsentGranted', 'status']
export const propagateConfigurationState = (configuration, value) => {
  configuration.value = value
  if (configuration.branches) {
    configuration.branches.forEach((branch) => {
      if (isMandatoryFields(branch.id)) {
        branch.value = value
        branch.mandatory = value
      }
      branch.value = value
      propagateConfigurationState(branch, value)
    })
  }
  return configuration
}

export const clearConfigurationsState = (configuration, value) => {
  if (configuration.id === 'email' || configuration.id === 'uid') {
    return // Skip configurations with id 'email' or 'uid'
  }
  configuration.value = value

  if (configuration.branches) {
    configuration.branches.forEach((branch) => {
      if (branch.branches.length === 0) {
        branch.mandatory = false
      }
      branch.value = value
      clearConfigurationsState(branch, value)
    })
  }
}

export const getAllConfiguration = (configurations, ids) => {
  const result = []

  ids.forEach((id) => {
    const path = id.split('.')
    let currentLevel = configurations
    let parentConfig = null

    path.forEach((part, index) => {
      const configId = path.slice(0, index + 1).join('.')
      const config = currentLevel.find((branch) => branch.id === configId || branch.id.endsWith(`.${part}`) || branch.id === part)
      if (config) {
        if (!parentConfig) {
          parentConfig = findOrCreateConfig(result, config)
        } else {
          parentConfig = findOrCreateConfig(parentConfig.branches, config)
        }
        currentLevel = config.branches
      }
    })

    if (parentConfig && parentConfig.branches.length === 0) {
      parentConfig.branches = currentLevel
    }
  })

  ids.forEach((id) => {
    if (result.length === 0 || !result.some((config) => config.id === id)) {
      const config = configurations.find((branch) => branch.id === id || branch.id.endsWith(`.${id}`) || branch.id === id)
      if (config) {
        result.push(config)
      }
    }
  })

  return result
}

const findOrCreateConfig = (configs, config) => {
  let existingConfig = configs.find((c) => c.id === config.id)
  if (!existingConfig) {
    existingConfig = { ...config, branches: [] }
    configs.push(existingConfig)
  }
  return existingConfig
}

const traverseWholeTree = (branches, childId, setParent) => {
  for (let branch of branches) {
    if (branch.id === childId) {
      propagateConfigurationState(branch, setParent)
      return setParent
    }
    if (traverseWholeTree(branch.branches, childId, setParent)) {
      branch.value = setParent
      return setParent
    }
  }
  return false
}

export const setParentsValue = (structure, childId, value) => {
  function checkAndSetParents(branches) {
    for (let branch of branches) {
      if (branch.branches && branch.branches.length > 0) {
        checkAndSetParents(branch.branches)
        branch.value = branch.branches.some((child) => child.value)
      }
    }
  }

  traverseWholeTree(structure, childId, value)
  checkAndSetParents(structure)
}

export const getConfigurationPath = (configurations, targetId) => {
  const path = targetId.split('.')

  const findPath = (nodes, path) => {
    if (path.length === 0) return null

    const [currentId, ...restPath] = path
    const node = nodes.find((node) => node.id === currentId || node.id.endsWith(`.${currentId}`))

    if (!node) return null

    if (restPath.length === 0) return node

    const childPath = findPath(node.branches, restPath)
    if (!childPath) return null

    return {
      ...node,
      branches: [childPath],
    }
  }

  return findPath(configurations, path)
}

export const propagateConfigurationSelectBox = (configuration, payload) => {
  configuration.switchId = payload.operation
  for (let branch of configuration.branches) {
    if (branch.branches.length === 0) {
      branch.switchId = payload.operation
    }
  }
}

export const isMandatoryFields = (branchId) => {
  return mandatoryFields.some((keyword) => branchId.includes(keyword))
}
