import * as CommonTestData from '../servicesData_test'
import * as TestData from '../configurator/data_test'
import GigyaManager from './gigyaManager'
import axios from 'axios'

jest.mock('axios')

describe('Emails Manager test suite', () => {
  const gigyaManager = new GigyaManager('userKey', 'secret')

  test('error getting data center', async () => {
    const err = CommonTestData.createErrorObject('Error configuring site')
    axios.mockImplementation(() => {
      throw err
    })
    const dataCenter = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(dataCenter).toBe('')
  })

  test('get data center', async () => {
    const expectedResponse = TestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValue({ data: expectedResponse })
    const dataCenter = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(dataCenter).toBe(expectedResponse.dataCenter)
  })
})
