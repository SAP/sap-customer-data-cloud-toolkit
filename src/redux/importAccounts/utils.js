export const propagateConfigurationState = (configuration, value) => {
  configuration.value = value
  if (configuration.branches) {
    configuration.branches.forEach((branch) => {
      branch.value = value
      propagateConfigurationState(branch, value)
    })
  }
}
export const propagateSugestionState = (configuration, value) => {
  configuration.value = value
  if (configuration.branches) {
    configuration.branches.forEach((branch) => {
      propagateConfigurationState(branch, value)
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
      const config = currentLevel.find((c) => c.id === configId || c.id.endsWith(`.${part}`) || c.id === part)
      if (config) {
        if (!parentConfig) {
          parentConfig = findOrCreateConfig(result, config)
        } else {
          parentConfig = findOrCreateConfig(parentConfig.branches, config)
        }
        currentLevel = config.branches
      }
    })

    // Ensure children are included
    if (parentConfig && parentConfig.branches.length === 0) {
      parentConfig.branches = currentLevel
    }
  })

  // Handle the case where the input is a single element
  ids.forEach((id) => {
    if (result.length === 0 || !result.some((config) => config.id === id)) {
      const config = configurations.find((c) => c.id === id || c.id.endsWith(`.${id}`) || c.id === id)
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

export const setParentsTrue = (structure, childId, value) => {
  function traverse(branches, childId, setParent) {
    for (let branch of branches) {
      if (branch.id === childId) {
        propagateConfigurationState(branch, value)
        return value
      }
      if (traverse(branch.branches, childId, setParent)) {
        branch.value = setParent
        return value
      }
    }
    return false
  }

  function checkAndSetParents(branches) {
    for (let branch of branches) {
      if (branch.branches && branch.branches.length > 0) {
        checkAndSetParents(branch.branches)
        branch.value = branch.branches.some((child) => child.value)
      }
    }
  }

  traverse(structure, childId, value)
  checkAndSetParents(structure)
}
export const getParent = (structure, parentId, targetId) => {
  const findParent = (nodes) => {
    for (const node of nodes) {
      if (node.id === parentId) {
        return node
      }
      if (node.branches && node.branches.length > 0) {
        const result = findParent(node.branches)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  const parent = findParent(structure)
  if (!parent) {
    return false
  }

  const traverse = (nodes) => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return true
      }
      if (node.branches && node.branches.length > 0) {
        const result = traverse(node.branches)
        if (result) {
          return true
        }
      }
    }
    return false
  }

  return traverse(parent.branches)
}
export const propagateConfigurationSelectBox = (configuration, payload) => {
  configuration.switchId = payload.operation
  for (let branch of configuration.branches) {
    if (branch.branches.length === 0) {
      branch.switchId = payload.operation
    }
  }
}
export const getParentIds = (configurations, targetId) => {
  const parentIds = []
  let currentId = targetId

  while (currentId) {
    const parent = findParent(configurations, currentId)
    if (parent) {
      parentIds.unshift(parent.id)
      currentId = parent.id
    } else {
      currentId = null
    }
  }

  return parentIds
}

const findParent = (configurations, targetId) => {
  for (const configuration of configurations) {
    if (configuration.branches) {
      for (const branch of configuration.branches) {
        if (branch.id === targetId) {
          return configuration
        }
        const parent = findParent(branch.branches, targetId)
        if (parent) {
          return parent
        }
      }
    }
  }
  return null
}
