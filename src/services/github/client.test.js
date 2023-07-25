/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import GitHubClient from './client'
import axios from 'axios'
import { gitHubExpectedErrorResponse, gitHubExpectedResponse } from './dataTest'

jest.mock('axios')
jest.setTimeout(10000)

let client

beforeAll(() => {
  axios.create.mockReturnThis()
  client = new GitHubClient('localhost', 'token')
})

describe('GitHub test suite', () => {
  test('1 - get latest release information successfully', async () => {
    axios.get.mockResolvedValueOnce(gitHubExpectedResponse)
    const response = await client.getLatestReleaseInformation()
    //console.log('response=' + JSON.stringify(response))
    expect(response).toBeDefined()
    expect(response.tag_name).toEqual('0.2.0')
  })

  test('2 - get latest release information error', async () => {
    const err = gitHubExpectedErrorResponse
    axios.get.mockImplementation(() => {
      throw err
    })

    await expect(client.getLatestReleaseInformation()).rejects.toEqual(err)
  })
})
