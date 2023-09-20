/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { expectedGigyaResponseOk } from '../../servicesDataTest.js'

const getSearchDataflowsExpectedResponse = {
  callId: '5e9c715e909a48c883aef5cf00000000',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-01-01T10:42:04.934Z',
  resultCount: 2,
  totalCount: 2,
  result: [
    {
      apiKey: 'apiKey',
      siteId: 12345,
      id: 'df1',
      name: 'dataflow1',
      status: 'published',
      description: 'workflow description',
      steps: [
        {
          id: 'stepId0',
          type: 'file.empty',
          params: {
            fileName: 'gigya.ok',
          },
        },
      ],
      version: 1,
      createTime: '2023-05-12T09:15:15.175Z',
      updateTime: '2023-05-12T09:15:15.175Z',
      updatedByName: 'User Name',
      updatedByEmail: 'user.name@sap.com',
    },
    {
      apiKey: 'apiKey',
      siteId: 12345,
      id: 'df2',
      name: 'dataflow2',
      status: 'draft',
      description: 'sftp > parse > injectJobId > importLiteAccount > format > sftp',
      steps: [
        {
          id: 'Read files from SFTP',
          type: 'datasource.read.sftp',
          params: {
            host: '{{hostname}}',
            username: '{{username}}',
            password: '********',
            fileNameRegex: '.*.json',
            port: 22,
            sortOrder: 'ASC',
            sortBy: 'time',
            timeout: 60,
          },
          next: ['parse JSON'],
        },
        {
          id: 'parse JSON',
          type: 'file.parse.json',
          params: {
            addFilename: false,
          },
          next: ['record.evaluate'],
        },
        {
          id: 'Import Lite Account',
          type: 'datasource.write.gigya.generic',
          params: {
            apiMethod: 'accounts.importLiteAccount',
            maxConnections: 20,
            apiParams: [
              {
                sourceField: 'profile',
                paramName: 'profile',
                value: '',
              },
              {
                sourceField: 'data',
                paramName: 'data',
                value: '',
              },
              {
                sourceField: 'email',
                paramName: 'email',
                value: '',
              },
              {
                sourceField: '{{mobile}}',
                paramName: '{{mobile}}',
                value: '{{phoneNumber}}',
              },
            ],
            addResponse: false,
            userKey: '{{userKey}}',
            secret: '********',
            privateKey: '********',
          },
          next: [],
          error: ['Format Error File'],
        },
        {
          id: 'Format Error File',
          type: 'file.format.json',
          params: {
            fileName: 'import_lite_{{accounts}}_errors_${now}.json',
            maxFileSize: 5000,
            createEmptyFile: false,
            wrapField: '{{wrapField}}',
          },
          next: ['Save errors to SFTP'],
        },
        {
          id: 'Save errors to SFTP',
          type: 'datasource.write.sftp',
          params: {
            host: '{{hostname}}',
            username: '{{username}}',
            password: '********',
            port: 22,
            remotePath: 'errors',
            temporaryUploadExtension: true,
            timeout: 60,
          },
        },
        {
          id: 'injectJobId',
          type: 'field.add',
          params: {
            fields: [
              {
                field: 'data.idxImportId',
                value: '${jobId}',
              },
              {
                field: 'data.injectValue',
                value: '{{injectValue}}',
              },
            ],
          },
          next: ['Import Lite Account'],
        },
        {
          id: 'record.evaluate',
          type: 'record.evaluate',
          params: {
            script: 'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7CiAgICAvLyBsb2cgIiN0ZXN0IgogICAgY29uc29sZS5sb2coInt7aG9zdG5hbWV9fSIpCiAgICByZXR1cm4gcmVjb3JkOwp9',
            ECMAScriptVersion: '12',
            notifyLastRecord: false,
          },
          next: ['injectJobId'],
        },
      ],
      version: 4,
      createTime: '2023-05-12T08:50:59.434Z',
      updateTime: '2023-05-12T10:05:24.786Z',
      updatedByName: 'User Name',
      updatedByEmail: 'user.name@sap.com',
    },
  ],
}

export function getEmptyDataflowResponse() {
  return Object.assign(expectedGigyaResponseOk, { resultCount: 0 })
}

export function getExpectedCreateDataflowResponse(index) {
  return Object.assign(expectedGigyaResponseOk, {
    id: getSearchDataflowsExpectedResponse.result[index],
    context: {
      id: `dataflows_${getSearchDataflowsExpectedResponse.result[index].name}`,
      targetApiKey: getSearchDataflowsExpectedResponse.result[index].apiKey,
    },
  })
}

export function getExpectedSetDataflowResponse(index) {
  return Object.assign(expectedGigyaResponseOk, {
    version: getSearchDataflowsExpectedResponse.result[index].version + 1,
    context: {
      id: `dataflows_${getSearchDataflowsExpectedResponse.result[index].name}`,
      targetApiKey: getSearchDataflowsExpectedResponse.result[index].apiKey,
    },
  })
}

export function getExpectedArgument(index) {
  switch (index) {
    case 0:
      return getSearchDataflowsExpectedResponse.result[index]
    case 1:
      const response = getSearchDataflowsExpectedResponse.result[index]
      response.steps[0].params.host = response.steps[0].params.host.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[0].params.username = response.steps[0].params.username.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[2].params.apiParams[3].sourceField = response.steps[2].params.apiParams[3].sourceField.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[2].params.apiParams[3].paramName = response.steps[2].params.apiParams[3].paramName.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[2].params.apiParams[3].value = response.steps[2].params.apiParams[3].value.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[2].params.userKey = response.steps[2].params.userKey.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[3].params.fileName = response.steps[3].params.fileName.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[3].params.wrapField = response.steps[3].params.wrapField.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[4].params.host = response.steps[4].params.host.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[4].params.username = response.steps[4].params.username.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[5].params.fields[1].value = response.steps[5].params.fields[1].value.replaceAll('{{', '').replaceAll('}}', '')
      response.steps[6].params.script = btoa(atob(response.steps[6].params.script).replaceAll('{{', '').replaceAll('}}', ''))
      return response
    default:
      return {}
  }
}

export function getResponseDataflowHasNotChanged() {
  return {
    callId: '5e9c715e909a48c883aef5cf00000000',
    errorCode: 403200,
    errorDetails: 'dataflow has not changed',
    errorMessage: 'Redundant Operation',
    apiVersion: 2,
    statusCode: 403,
    statusReason: 'Forbidden',
    time: '2023-01-01T10:42:04.934Z',
  }
}

export { getSearchDataflowsExpectedResponse }
