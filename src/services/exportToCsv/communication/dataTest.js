export const mockCommunicationStructure = [
  {
    id: 'communications',
    name: 'communications',
    value: true,
    branches: [
      {
        id: 'C_Email',
        name: 'C_Email',
        value: true,
        branches: [
          {
            id: 'communications.C_Email.status',
            name: 'status',
            value: true,
            branches: [],
            mandatory: true,
          },
        ],
      },
      {
        id: 'T_Email',
        name: 'T_Email',
        value: true,
        branches: [
          {
            id: 'communications.T_Email.status',
            name: 'status',
            value: true,
            branches: [],
            mandatory: true,
          },
        ],
      },
      {
        id: 'C_mobileApp',
        name: 'C_mobileApp',
        value: true,
        branches: [
          {
            id: 'communications.C_mobileApp.status',
            name: 'status',
            value: true,
            branches: [],
            mandatory: true,
          },
          {
            id: 'communications.C_mobileApp.optIn.acceptanceLocation',
            name: 'acceptanceLocation',
            value: true,
            branches: [],
          },
          {
            id: 'communications.C_mobileApp.optIn.sourceApplication',
            name: 'sourceApplication',
            value: true,
            branches: [],
          },
        ],
      },
      {
        id: 'C_whatsApp',
        name: 'C_whatsApp',
        value: true,
        branches: [
          {
            id: 'communications.C_whatsApp.status',
            name: 'status',
            value: true,
            branches: [],
            mandatory: true,
          },
        ],
      },
      {
        id: 'T_SMS',
        name: 'T_SMS',
        value: true,
        branches: [
          {
            id: 'communications.T_SMS.status',
            name: 'status',
            value: true,
            branches: [],
            mandatory: true,
          },
        ],
      },
      {
        id: 'C_SMS',
        name: 'C_SMS',
        value: true,
        branches: [
          {
            id: 'communications.C_SMS.status',
            name: 'status',
            value: true,
            branches: [],
            mandatory: true,
          },
          {
            id: 'communications.C_SMS.optIn.acceptanceLocation',
            name: 'acceptanceLocation',
            value: true,
            branches: [],
          },
        ],
      },
    ],
  },
]

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
