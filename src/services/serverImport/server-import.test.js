import ServerImport from './server-import.js'
import { credentials, importLiteAccountAzure, importFullAccountAzure } from '../servicesDataTest.js'
import axios from 'axios'
jest.mock('axios')

describe('ServerImport Test Suite', () => {
  const site = 'testSite'
  const dataCenter = 'us1'
  const serverImport = new ServerImport(credentials, site, dataCenter)

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
    axios.mockResolvedValueOnce({ data: { id: 'dataflowId' } })
    axios.mockResolvedValueOnce({ data: { success: true } })
    const configurations = {
      azure: {
        '{{dataflowName}}': 'Test Dataflow',
        '{{accountName}}': 'Test Account',
      },
    }
    const option = { option: 'azure' }
    const accountOption = 'Lite'

    const result = await serverImport.setDataflow(configurations, option, accountOption)
    expect(result.success).toBe(true)
  })

  test('should get configurations', () => {
    const configurations = {
      azure: {
        '{{dataflowName}}': 'Test Dataflow',
        '{{accountName}}': 'Test Account',
      },
    }
    const key = 'azure'
    const result = serverImport.getConfigurations(configurations, key)
    expect(result).toEqual(configurations.azure)
  })

  test('should create schedule structure', () => {
    const response = { id: 'dataflowId' }
    const expectedStructure = {
      data: {
        name: 'server_import_scheduler',
        dataflowId: 'dataflowId',
        frequencyType: 'once',
        fullExtract: true,
      },
    }
    const result = serverImport.scheduleStructure(response)
    expect(result).toEqual(expectedStructure)
  })
})
