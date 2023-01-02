const gitHubExpectedErrorResponse = {
  code: 'ERR_BAD_REQUEST',
  message: 'Request failed with status code 404',
  name: 'AxiosError',
}

const gitHubExpectedResponse = {
  url: 'https://github.tools.sap/api/v3/repos/cx-servicesautomation/cdc-tools-chrome-extension/releases/100320',
  assets_url: 'https://github.tools.sap/api/v3/repos/cx-servicesautomation/cdc-tools-chrome-extension/releases/100320/assets',
  upload_url: 'https://github.tools.sap/api/uploads/repos/cx-servicesautomation/cdc-tools-chrome-extension/releases/100320/assets{?name,label}',
  html_url: 'https://github.tools.sap/cx-servicesautomation/cdc-tools-chrome-extension/releases/tag/0.2.0',
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
      url: 'https://github.tools.sap/api/v3/repos/cx-servicesautomation/cdc-tools-chrome-extension/releases/assets/35336',
      id: 35336,
      node_id: 'MDEyOlJlbGVhc2VBc3NldDM1MzM2',
      name: 'cdc-tools-chrome-extension-0.2.0.zip',
      label: null,
      uploader: {},
      content_type: 'application/zip',
      state: 'uploaded',
      size: 1018121,
      download_count: 1,
      created_at: '2022-12-13T13:38:38Z',
      updated_at: '2022-12-13T13:38:38Z',
      browser_download_url: 'https://github.tools.sap/cx-servicesautomation/cdc-tools-chrome-extension/releases/download/0.2.0/cdc-tools-chrome-extension-0.2.0.zip',
    },
  ],
  tarball_url: 'https://github.tools.sap/api/v3/repos/cx-servicesautomation/cdc-tools-chrome-extension/tarball/0.2.0',
  zipball_url: 'https://github.tools.sap/api/v3/repos/cx-servicesautomation/cdc-tools-chrome-extension/zipball/0.2.0',
  body: '*',
}

export { gitHubExpectedErrorResponse, gitHubExpectedResponse }
