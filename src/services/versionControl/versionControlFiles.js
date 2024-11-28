/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const getFileTypeFromFileName = (filename) => {
  const mapping = {
    'webSdk.json': 'webSdk',
    'dataflow.json': 'dataflow',
    'emails.json': 'emails',
    'extension.json': 'extension',
    'policies.json': 'policies',
    'rba.json': 'rba',
    'riskAssessment.json': 'riskAssessment',
    'schema.json': 'schema',
    'sets.json': 'sets',
    'sms.json': 'sms',
    'channel.json': 'channel',
  }

  return mapping[Object.keys(mapping).find((key) => filename.includes(key))]
}
