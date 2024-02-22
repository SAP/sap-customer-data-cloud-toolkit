/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import crypto from 'crypto-js'
import i18n from '../../i18n'
import { getApiKey } from '../utils'
import { areAllVariablesSet } from '../../components/dataflow-settings/utils'

const LOCAL_STORAGE_AVAILABLE_TARGET_SITES_KEY = 'availableTargetSites'

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

const mapSpecialCheckboxId = (checkBoxId) => {
  const COMMUNICATION_PREFIX = 'communication'
  const COMMUNICATION_CHECKBOX_ID = 'communicationTopics'
  const CONSENT_PREFIX = 'consent'
  const CONSENT_CHECKBOX_ID = 'consent'
  const RBA_PREFIX = 'rba.'
  const RBA_CHECKBOX_ID = 'rba'
  let mappedCheckboxId = checkBoxId

  if (checkBoxId.startsWith(COMMUNICATION_PREFIX)) {
    mappedCheckboxId = COMMUNICATION_CHECKBOX_ID
  }

  if (checkBoxId.startsWith(CONSENT_PREFIX)) {
    mappedCheckboxId = CONSENT_CHECKBOX_ID
  }

  if (checkBoxId.startsWith(RBA_PREFIX)) {
    mappedCheckboxId = RBA_CHECKBOX_ID
  }
  return mappedCheckboxId
}

export const addErrorToConfigurations = (configurations, errors) => {
  for (const error of errors) {
    const checkBoxId = mapSpecialCheckboxId(error.context.id)
    const configuration = findConfiguration(configurations, checkBoxId)
    if (configuration) {
      if (!configuration.error) {
        configuration.error = []
      }
      configuration.error.push(error)
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
      configuration.error = err.flat()
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

export const writeAvailableTargetSitesToLocalStorage = (availableTargetSites, key) => {
  if (Array.isArray(availableTargetSites) && availableTargetSites.length !== 0) {
    const encryptedData = encryptData(availableTargetSites, key)
    if (encryptedData) {
      localStorage.setItem(LOCAL_STORAGE_AVAILABLE_TARGET_SITES_KEY, encryptedData)
    }
  }
}

export const getAvailableTargetSitesFromLocalStorage = (key) => {
  const encryptedLocalStorageAvailableTargetSitesString = localStorage.getItem(LOCAL_STORAGE_AVAILABLE_TARGET_SITES_KEY)
  return decryptData(encryptedLocalStorageAvailableTargetSitesString, key)
}

const encryptData = (dataToEncrypt, key) => {
  try {
    const encryptedJsonString = crypto.AES.encrypt(JSON.stringify(dataToEncrypt), key).toString()
    return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(encryptedJsonString))
  } catch (error) {
    return undefined
  }
}

const decryptData = (encryptedData, key) => {
  try {
    const decodedData = crypto.enc.Base64.parse(encryptedData).toString(crypto.enc.Utf8)
    return JSON.parse(crypto.AES.decrypt(decodedData, key).toString(crypto.enc.Utf8))
  } catch (error) {
    return undefined
  }
}

export const removeCurrentSiteApiKeyFromAvailableTargetSites = (availableTargetSites, currentSiteApiKey) => {
  return availableTargetSites.filter((site) => site.apiKey !== currentSiteApiKey)
}

export const checkDataflowVariables = (configurations) => {
  let responses = []
  const dataflowsRoot = configurations.filter((configuration) => configuration.id === 'dataflows')[0]

  let dataflows = []
  if (dataflowsRoot) {
    dataflows = dataflowsRoot.branches
  }

  for (const dataflow of dataflows) {
    if (dataflow.value && dataflow.variables && !areAllVariablesSet(dataflow.variables)) {
      responses.push({
        errorCode: 400,
        errorMessage: i18n.t('COPY_CONFIGURATION_EXTENDED.DATAFLOWS_VARIALBLES_ERROR_MESSAGE'),
        errorDetails: i18n.t('COPY_CONFIGURATION_EXTENDED.DATAFLOWS_VARIALBLES_ERROR_DETAIL', { dataflowId: dataflow.id }),
        context: { id: dataflow.id },
      })
    }
  }

  return responses
}
