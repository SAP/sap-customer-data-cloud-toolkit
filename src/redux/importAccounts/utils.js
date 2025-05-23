/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { findConfiguration } from '../copyConfigurationExtended/utils'
const mandatoryFields = ['isSubscribed', 'isConsentGranted', 'status']
const mandatoryParentFields = ['communications', 'subscriptions', 'preferences']
const emailFieldId = 'email'
const uidFieldId = 'uid'
export const propagateConfigurationState = (configuration, value) => {
  configuration.value = value
  if (configuration.branches) {
    const parentId = configuration.id.split('.')
    configuration.branches.forEach((branch) => {
      if (isMandatoryFields(branch.id) && isParentMandatoryFields(parentId[0])) {
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
  if (configuration.id === emailFieldId || configuration.id === uidFieldId) {
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
export const isParentMandatoryFields = (id) => mandatoryParentFields.includes(id)
export const updateMandatoryFields = (structure, value) => {
  if (isMandatoryFields(structure.id)) {
    structure.value = value
    structure.mandatory = value
  }
  if (structure.branches && structure.branches.length > 0) {
    structure.branches.forEach((branch) => updateMandatoryFields(branch, value))
  }
  return structure
}

export const hasMandatoryFieldInSugestion = (structure, parentId, parentNode, value) => {
  if (parentId.length <= 3) {
    parentNode = parentId.slice(0, -1).join('.')
  } else {
    parentNode = parentId.slice(0, -2).join('.')
  }
  if (parentNode && isParentMandatoryFields(parentId[0])) {
    const parent = findConfiguration(structure, parentNode)
    if (parent) {
      updateMandatoryFields(parent, value)
    }
  }
}

export const setSugestionItemParent = (sugestedStructure, structure, childId, value) => {
  let parentId = childId.split('.')
  let parentNode
  hasMandatoryFieldInSugestion(structure, parentId, parentNode, value)

  checkAndSetParents(sugestedStructure)
  traverseWholeTree(sugestedStructure, childId, value)
  return sugestedStructure
}

export const setParentsValue = (structure, childId, value) => {
  traverseWholeTree(structure, childId, value)
  checkAndSetParents(structure)
}

function checkAndSetParents(branches) {
  for (let branch of branches) {
    if (branch.branches && branch.branches.length > 0) {
      checkAndSetParents(branch.branches)
      branch.value = branch.branches.some((child) => child.value)
    }
  }
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
