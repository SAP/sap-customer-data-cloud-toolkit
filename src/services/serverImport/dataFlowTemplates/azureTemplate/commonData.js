/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
/* eslint-disable no-template-curly-in-string */
export const commonSteps = [
  {
    id: 'azure.blob',
    type: 'datasource.read.azure.blob',
    params: {
      accountName: '{{accountName}}',
      accountKey: '{{accountKey}}',
      container: '{{container}}',
      fileNameRegex: '{{readFileNameRegex}}',
      blobPrefix: '{{blobPrefix}}',
    },
    next: ['file.parse.dsv'],
  },
  {
    id: 'file.parse.dsv',
    type: 'file.parse.dsv',
    params: {
      columnSeparator: ',',
      fileCharset: 'UTF-8',
      inferTypes: false,
      addFilename: false,
    },
    next: ['Transform to CDC Structure'],
  },
]

export const commonError = [
  {
    id: 'Error File',
    type: 'file.format.dsv',
    params: {
      fileName: 'Error_LiteAccount_Upload_${now}.csv',
      columnSeparator: ',',
      escapeCharacter: '\\',
      maxFileSize: 2,
      writeHeader: true,
      dsvFormatVersion: 'Standard',
      lineEnd: '\n',
      quoteFields: false,
      createEmptyFile: false,
    },
    next: ['Write to Azure Blobs'],
  },
  {
    id: 'Write to Azure Blobs',
    type: 'datasource.write.azure.blob',
    params: {
      accountName: '{{accountName}}',
      accountKey: '{{accountKey}}',
      container: '{{container}}',
    },
  },
]

export const commonErrorResponse = [
  {
    id: 'Import Account Error Response',
    type: 'record.evaluate',
    params: {
      script:
        'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IEVycm9yIFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgcmV0dXJuIHJlY29yZDsNCn0=',
      ECMAScriptVersion: '12',
      notifyLastRecord: false,
    },
    next: ['Error File'],
  },
]
