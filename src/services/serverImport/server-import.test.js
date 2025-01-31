/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import ServerImport from './server-import.js'
import { credentials } from '../servicesDataTest.js'
import axios from 'axios'
import { commonConfigurations, commonOption, expectedResultReplaceVariables, expectedScheduleStructure, mockedCreateDataflowResponseOk } from './dataTest.js'
import { getExpectedCreateDataflowResponse, getSearchDataflowsExpectedResponse } from '../copyConfig/dataflow/dataTest.js'
import { setConfigSuccessResponse } from '../../redux/copyConfigurationExtended/dataTest.js'
import { getResponseWithContext } from '../copyConfig/dataTest.js'
jest.mock('axios')

describe('ServerImport Test Suite', () => {
  const site = 'apiKey'
  const dataCenter = 'us1'
  const serverImport = new ServerImport(credentials, site, dataCenter)
  const commonAccountOption = 'Lite'

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('should get structure', () => {
    const structure = serverImport.getStructure()
    expect(structure).toBeDefined()
  })

  test('should replace variables in dataflow', () => {
    const dataflow = {
      name: '{{dataflowName}}',
      steps: [
        {
          id: 'step1',
          params: {
            accountName: '{{accountName}}',
          },
        },
      ],
    }

    const variables = [
      { id: '{{dataflowName}}', value: 'Test Dataflow' },
      { id: '{{accountName}}', value: 'Test Account' },
    ]

    const expectedDataflow = {
      name: 'Test Dataflow',
      steps: [
        {
          id: 'step1',
          params: {
            accountName: 'Test Account',
          },
        },
      ],
    }

    const result = serverImport.replaceVariables(dataflow, variables)
    expect(result).toEqual(expectedDataflow)
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
    const result = await serverImport.setDataflow(commonConfigurations, commonOption, commonAccountOption)
    expect(result).toEqual(createDataflowResponse.id.id)
  })

  test('should get configurations', () => {
    const key = 'azure'
    const result = serverImport.getConfigurations(commonConfigurations, key)
    expect(result).toEqual(commonConfigurations.azure)
  })

  test('should create schedule structure', () => {
    const responseId = 'dataflowId'
    const result = serverImport.scheduleStructure(responseId)
    expect(result).toEqual(expectedScheduleStructure)
  })

  test('should replace variables ', () => {
    const variables = [
      { id: '{{dataflowName}}', value: 'Test Id' },
      { id: '{{accountName}}', value: 'Test Account' },
    ]
    const result = serverImport.replaceVariables(commonConfigurations, variables)
    expect(result).toEqual(expectedResultReplaceVariables)
  })
})
