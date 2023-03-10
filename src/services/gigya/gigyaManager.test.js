import * as CommonTestData from '../servicesDataTest'
import * as TestData from '../configurator/dataTest'
import GigyaManager from './gigyaManager'
import axios from 'axios'
import SiteConfigurator from '../configurator/siteConfigurator'

jest.mock('axios')

describe('Emails Manager test suite', () => {
  const gigyaManager = new GigyaManager('userKey', 'secret')

  test('error getting data center', async () => {
    const err = CommonTestData.createErrorObject(SiteConfigurator.ERROR_MSG_CONFIG)
    axios.mockImplementation(() => {
      throw err
    })
    const response = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(response.errorCode).not.toBe(0)
    expect(response.dataCenter).toBeUndefined()
    expect(response.errorMessage).toEqual(err.message)
  })

  test('get data center', async () => {
    const expectedResponse = TestData.getSiteConfigSuccessfullyMultipleMember(0)
    axios.mockResolvedValue({ data: expectedResponse })
    const response = await gigyaManager.getDataCenterFromSite('apiKey')
    expect(response.errorCode).toBe(0)
    expect(response.dataCenter).toBe(expectedResponse.dataCenter)
  })
})
