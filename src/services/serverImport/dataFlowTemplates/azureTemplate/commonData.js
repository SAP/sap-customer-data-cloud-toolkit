/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
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
