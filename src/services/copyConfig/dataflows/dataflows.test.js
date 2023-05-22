import Dataflows from './dataflows'
import { credentials } from '../../servicesDataTest'
jest.mock('axios')
jest.setTimeout(10000)

describe('dataflow test suite', () => {
  test('search test', async () => {
    const dataflow = new Dataflows(credentials, '4_6Tv6z8O6NmUO_BZoHcXIRw', 'us1')
    const response = await dataflow.search()
    console.log(response)
  })
})
