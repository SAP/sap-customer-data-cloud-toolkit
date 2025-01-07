/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { propagateConfigurationState } from '../../../redux/importAccounts/utils'
import { exportCommunicationData } from './communicationMatches'
import { mockCommunicationStructure, expectedCommunicationsResult } from './dataTest'

jest.mock('axios')
jest.setTimeout(10000)

describe('Import Account - CommunicationImport test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('Export communication Data', () => {
    const configuration = propagateConfigurationState(mockCommunicationStructure, true)
    const communicationData = exportCommunicationData([configuration])
    expect(communicationData).toEqual(expectedCommunicationsResult)
  })
})
