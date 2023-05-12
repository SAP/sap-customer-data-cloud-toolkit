/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
