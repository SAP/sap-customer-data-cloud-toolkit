/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import axios from 'axios'

class GitHubClient {
  constructor(baseUrl, token) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async getLatestReleaseInformation() {
    return this.axiosInstance.get('/repos/cx-servicesautomation/cdc-tools-chrome-extension/releases/latest')
  }
}

export default GitHubClient
