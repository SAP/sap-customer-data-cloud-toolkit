import { communicationsBranches } from '../../importAccounts/mainDataSet'

export const mockCommunicationStructure = { id: 'communications', name: 'communications', value: false, branches: communicationsBranches }

export const expectedCommunicationsResult = [
  'communications.C_Email.status',
  'communications.T_Email.status',
  'communications.C_mobileApp.status',
  'communications.C_mobileApp.optIn.acceptanceLocation',
  'communications.C_mobileApp.optIn.sourceApplication',
  'communications.C_whatsApp.status',
  'communications.T_SMS.status',
  'communications.C_SMS.status',
  'communications.C_SMS.optIn.acceptanceLocation',
]
