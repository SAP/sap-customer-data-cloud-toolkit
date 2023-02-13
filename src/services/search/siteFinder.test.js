import * as CommonTestData from '../servicesDataTest'
import axios from 'axios'
import { expectedGetPartnersResponseOk, getExpectedGetPartnerSitesResponseOk } from './dataTest'
import SiteFinder from './siteFinder'
import { expectedGigyaInvalidUserKey } from '../servicesDataTest'

jest.mock('axios')

describe('Site Finder test suite', () => {
  const siteFinder = new SiteFinder(CommonTestData.credentials)

  test('get all sites successfully', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedGetPartnersResponseOk })
      .mockResolvedValueOnce({ data: getExpectedGetPartnerSitesResponseOk(0) })
      .mockResolvedValueOnce({ data: getExpectedGetPartnerSitesResponseOk(1) })

    const response = await siteFinder.getAllSites()
    //console.log('response=' + JSON.stringify(response))
    expect(response.length).toEqual(6)
    expect(isValid(response, 0)).toBeTruthy()
    expect(isValid(response, 1)).toBeTruthy()
  })

  test('get all sites unsuccessfully - error on get partners', async () => {
    axios.mockResolvedValueOnce({ data: expectedGigyaInvalidUserKey })
    await expect(siteFinder.getAllSites()).rejects.toEqual([expectedGigyaInvalidUserKey])
  })

  test('get all sites unsuccessfully - error on get partner sites', async () => {
    axios
      .mockResolvedValueOnce({ data: expectedGetPartnersResponseOk }) // 2 partners
      .mockResolvedValueOnce({ data: getExpectedGetPartnerSitesResponseOk(0) })
      .mockResolvedValueOnce({ data: expectedGigyaInvalidUserKey })
    await expect(siteFinder.getAllSites()).rejects.toEqual([expectedGigyaInvalidUserKey])
  })

  function isValid(response, instance) {
    let i = 3 * instance
    for (const site of getExpectedGetPartnerSitesResponseOk(instance).sites) {
      expect(response[i++]).toEqual({
        apiKey: site.apiKey,
        baseDomain: site.name,
        dataCenter: site.datacenter,
        partnerId: expectedGetPartnersResponseOk.partners[instance].partner.PartnerID,
        partnerName: expectedGetPartnersResponseOk.partners[instance].partner.Name,
      })
    }
    return true
  }
})
