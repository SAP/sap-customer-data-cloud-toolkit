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
export const getAllConfiguration = (branches, targetId) => {
  for (const branch of branches) {
    if (branch.id === targetId) {
      return [branch]
    }
    if (branch.branches.length > 0) {
      const path = getAllConfiguration(branch.branches, targetId)
      if (path.length > 0) {
        return [{ ...branch, branches: path }]
      }
    }
  }
  return []
}
export const setParentsTrue = (structure, childId) => {
  function traverse(branches, childId, setParent) {
    for (let branch of branches) {
      if (branch.id === childId) {
        return true
      }
      if (traverse(branch.branches, childId, setParent)) {
        branch.value = setParent
        return true
      }
    }
    return false
  }

  traverse(structure, childId, true)
}
export const propagateConfigurationSelectBox = (configuration, operation) => {
  for (let branch of configuration.branches) {
    console.log('branch....>', branch)
    if (branch.branches.length === 0) {
      branch.switchId = operation
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
