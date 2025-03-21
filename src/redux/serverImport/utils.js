/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

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

export const serverStructure = {
  azure: [
    { id: '{{dataflowName}}', name: 'Dataflow Name *', type: 'text', placeholder: 'Enter your Dataflow Name', tooltip: 'The name of the dataflow.' },
    { id: '{{accountName}}', name: 'Account Name *', type: 'text', placeholder: 'Enter your Account Name', tooltip: 'The Azure account name.' },
    { id: '{{accountKey}}', name: 'Account Key *', type: 'text', placeholder: 'Enter your Account Key', tooltip: 'The Azure account key.' },
    { id: '{{container}}', name: 'Container *', type: 'text', placeholder: 'Enter your Container', tooltip: 'The blob container name.' },
    { id: '{{readFileNameRegex}}', name: 'File Name Regex', type: 'text', placeholder: 'Enter your File Name Regex', tooltip: 'A regular expression to apply for file filtering.' },
    { id: '{{blobPrefix}}', name: 'Blob Prefix', type: 'text', placeholder: 'Enter your Blob Prefix', tooltip: 'The prefix to filter blobs upon download.' },
  ],
}
