/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import ServerImport from './server-import.js'
import { credentials } from '../../servicesDataTest.js'
import axios from 'axios'
import { commonConfigurations, commonOption, mockedCreateDataflowResponseOk } from './dataTest.js'
import { getExpectedCreateDataflowResponse, getSearchDataflowsExpectedResponse } from '../../copyConfig/dataflow/dataTest.js'
import { setConfigSuccessResponse } from '../../../redux/copyConfigurationExtended/dataTest.js'
import { getResponseWithContext } from '../../copyConfig/dataTest.js'
jest.mock('axios')

describe('ServerImport Test Suite', () => {
  const site = 'apiKey'
  const dataCenter = 'us1'
  const testTemplate = `{"id" : "test"}`
  const serverImport = new ServerImport(credentials, site, dataCenter, testTemplate)

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('should set dataflow for azure option', async () => {
    const createDataflowResponse = getExpectedCreateDataflowResponse(0)
    axios
      .mockResolvedValueOnce({ data: mockedCreateDataflowResponseOk })
      .mockResolvedValueOnce({
        data: getResponseWithContext(getSearchDataflowsExpectedResponse, `${createDataflowResponse.id.id}_search`, createDataflowResponse.id.apiKey),
      })
      .mockResolvedValueOnce({
        data: getResponseWithContext(setConfigSuccessResponse, `${createDataflowResponse.id.id}_search`, createDataflowResponse.id.apiKey),
      })
      .mockResolvedValueOnce({ data: createDataflowResponse.id.id })
      .mockResolvedValueOnce({ data: setConfigSuccessResponse })
    const result = await serverImport.setDataflow(commonConfigurations, commonOption)
    expect(result).toEqual(createDataflowResponse.id.id)
  })

  test('should get configurations', () => {
    const key = 'azure'
    const result = serverImport.getConfigurations(commonConfigurations, key)
    expect(result).toEqual(commonConfigurations.azure)
  })
})
