/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import * as CommonTestData from '../servicesDataTest'
import axios from 'axios'
import { expectedGetPartnersResponseOk, getExpectedGetPartnerSitesResponseOk } from './dataTest'
import SiteFinderPaginated from './siteFinderPaginated'
import { expectedGigyaInvalidUserKey } from '../servicesDataTest'

jest.mock('axios')

describe('Site Finder Paginated test suite', () => {
  test('get info in several pages successfully', async () => {
    await executeTest(1)
  })

  test('get info in one page successfully', async () => {
    await executeTest(100)
  })

  test('no data available', async () => {
    const siteFinderPaginated = new SiteFinderPaginated(CommonTestData.credentials, 1)
    const mockedResponse = JSON.parse(JSON.stringify(expectedGetPartnersResponseOk))
    mockedResponse.partners = []
    axios.mockResolvedValueOnce({ data: mockedResponse })

    let response = await siteFinderPaginated.getFirstPage()
    expect(response).toBeUndefined()
  })

  test('error on get partners', async () => {
    const siteFinderPaginated = new SiteFinderPaginated(CommonTestData.credentials, 1)
    axios.mockResolvedValueOnce({ data: expectedGigyaInvalidUserKey })
    await expect(siteFinderPaginated.getFirstPage()).rejects.toEqual([expectedGigyaInvalidUserKey])
  })

  test('error on get partner sites', async () => {
    const siteFinderPaginated = new SiteFinderPaginated(CommonTestData.credentials, 100)
    axios
      .mockResolvedValueOnce({ data: expectedGetPartnersResponseOk }) // 2 partners
      .mockResolvedValueOnce({ data: getExpectedGetPartnerSitesResponseOk(0) })
      .mockResolvedValueOnce({ data: expectedGigyaInvalidUserKey })
    await expect(siteFinderPaginated.getFirstPage()).rejects.toEqual([expectedGigyaInvalidUserKey])
  })

  async function executeTest(requestsPerPage) {
    const siteFinderPaginated = new SiteFinderPaginated(CommonTestData.credentials, requestsPerPage)
    const sites = []
    axios
      .mockResolvedValueOnce({ data: expectedGetPartnersResponseOk })
      .mockResolvedValueOnce({ data: getExpectedGetPartnerSitesResponseOk(0) })
      .mockResolvedValueOnce({ data: getExpectedGetPartnerSitesResponseOk(1) })

    let response = await siteFinderPaginated.getFirstPage()
    expect(isValid(response, 0)).toBeTruthy()

    sites.push(...response)
    while ((response = await siteFinderPaginated.getNextPage()) !== undefined) {
      expect(isValid(response, 1)).toBeTruthy()
      sites.push(...response)
    }
    expect(sites.length).toEqual(6)
  }

  function isValid(response, instance) {
    let i = 0
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
