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
    const response = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(response.errorCode).not.toBe(0)
    expect(response.dataCenter).toBeUndefined()
  })

  test('get data center', async () => {
    const expectedResponse = TestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValue({ data: expectedResponse })
    const response = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(response.errorCode).toBe(0)
    expect(response.dataCenter).toBe(expectedResponse.dataCenter)
  })
})
