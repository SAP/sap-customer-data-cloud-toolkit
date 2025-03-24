/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const commonConfigurations = {
  azure: [
    {
      id: '{{dataflowName}}',
      accountName: '{{accountName}}',
      type: 'text',
      placeholder: 'Enter your Dataflow Name',
      tooltip: 'The name of the dataflow.',
      value: 'asd',
    },
  ],
}
export const mockedCreateDataflowResponseOk = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  apiVersion: 2,
  time: Date.now(),
  id: 'df1',
}
export const expectedResultReplaceVariables = {
  azure: [
    {
      id: 'Test Id',
      accountName: 'Test Account',
      type: 'text',
      placeholder: 'Enter your Dataflow Name',
      tooltip: 'The name of the dataflow.',
      value: 'asd',
    },
  ],
}

export const commonOption = { option: 'azure' }

export const expectedScheduleStructure = {
  data: {
    name: 'server_import_scheduler',
    dataflowId: 'dataflowId',
    frequencyType: 'once',
    fullExtract: true,
  },
}
