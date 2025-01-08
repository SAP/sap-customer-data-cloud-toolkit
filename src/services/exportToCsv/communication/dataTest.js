/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { communicationsBranches } from '../../importAccounts/mainDataSet'

export const mockCommunicationStructure = { id: 'communications', name: 'communications', value: false, branches: communicationsBranches }

export const expectedCommunicationsResult = [
  'communications.C_Email.status',
  'communications.T_Email.status',
  'communications.C_mobileApp.status',
  'communications.C_mobileApp.optIn.acceptanceLocation',
  'communications.C_mobileApp.optIn.sourceApplication',
]
