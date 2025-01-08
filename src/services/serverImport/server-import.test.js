import ServerImport from './server-import.js'
import { credentials, expectedGigyaResponseOk } from '../servicesDataTest.js'
import axios from 'axios'
import { commonConfigurations, commonOption, expectedScheduleStructure, scheduleResponse } from './dataTest.js'
jest.mock('axios')

describe('ServerImport Test Suite', () => {
  const site = 'testSite'
  const dataCenter = 'us1'
  const serverImport = new ServerImport(credentials, site, dataCenter)

  const commonAccountOption = 'Lite'

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
    axios.mockResolvedValueOnce({ data: commonConfigurations }).mockResolvedValueOnce({ data: scheduleResponse })
    const result = await serverImport.setDataflow(commonConfigurations, commonOption, commonAccountOption)
    expect(result).toEqual(scheduleResponse)
  })

  test('should get configurations', () => {
    const key = 'azure'
    const result = serverImport.getConfigurations(commonConfigurations, key)
    expect(result).toEqual(commonConfigurations.azure)
  })

  test('should create schedule structure', () => {
    const response = { id: 'dataflowId' }

    const result = serverImport.scheduleStructure(response)
    expect(result).toEqual(expectedScheduleStructure)
  })
})
