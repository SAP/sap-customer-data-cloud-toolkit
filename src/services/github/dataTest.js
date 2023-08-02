/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


const gitHubExpectedErrorResponse = {
  code: 'ERR_BAD_REQUEST',
  message: 'Request failed with status code 404',
  name: 'AxiosError',
}

const gitHubExpectedResponse = {
  url: 'api.github.com/repos/SAP/sap-customer-data-cloud-toolkit/releases/100320',
  assets_url: 'api.github.com/repos/SAP/sap-customer-data-cloud-toolkit/releases/100320/assets',
  html_url: 'api.github.com/repos/SAP/sap-customer-data-cloud-toolkit/releases/tag/0.2.0',
  id: 100320,
  author: {
    login: 'Iuser',
  },
  node_id: 'MDc6UmVsZWFzZTEwMDMyMA==',
  tag_name: '0.2.0',
  target_commitish: 'main',
  name: 'Release 0.2.0',
  draft: false,
  prerelease: false,
  created_at: '2022-12-13T13:38:32Z',
  published_at: '2022-12-13T13:38:36Z',
  assets: [
    {
      url: 'api.github.com/repos/SAP/sap-customer-data-cloud-toolkit/releases/assets/35336',
      id: 35336,
      node_id: 'MDEyOlJlbGVhc2VBc3NldDM1MzM2',
      name: 'sap-customer-data-cloud-toolkit-0.2.0.zip',
      label: null,
      uploader: {},
      content_type: 'application/zip',
      state: 'uploaded',
      size: 1018121,
      download_count: 1,
      created_at: '2022-12-13T13:38:38Z',
      updated_at: '2022-12-13T13:38:38Z',
      browser_download_url: 'github.com/repos/SAP/sap-customer-data-cloud-toolkit/releases/download/0.2.0/sap-customer-data-cloud-toolkit-0.2.0.zip',
    },
  ],
  tarball_url: 'api.github.com/repos/SAP/sap-customer-data-cloud-toolkit/tarball/0.2.0',
  zipball_url: 'api.github.com/repos/SAP/sap-customer-data-cloud-toolkit/zipball/0.2.0',
  body: '*',
}

export { gitHubExpectedErrorResponse, gitHubExpectedResponse }
