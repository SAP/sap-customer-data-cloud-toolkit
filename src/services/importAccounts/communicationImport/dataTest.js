export const expectedCommunicationResponse = {
  callId: 'e2190759063c429087f674bff0087ea5',
  context: '{}',
  errorCode: 0,
  errorDetails: '',
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2024-12-20T16:06:40.421Z',
  results: [
    {
      topicChannelId: 'C_Email',
      channel: 'Email',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:37.688Z',
    },
    {
      topicChannelId: 'T_Email',
      channel: 'Email',
      topic: 'transactional',
      description: '',
      lastModified: '2024-11-20T10:46:18.726Z',
    },
    {
      schema: {
        properties: {
          optIn: {
            properties: {
              acceptanceLocation: {
                type: 'string',
              },
              sourceApplication: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      topicChannelId: 'C_mobileApp',
      channel: 'mobileApp',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:38.326Z',
    },
    {
      topicChannelId: 'C_whatsApp',
      channel: 'whatsApp',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:39.422Z',
    },
    {
      topicChannelId: 'T_SMS',
      channel: 'SMS',
      topic: 'transactional',
      description: '',
      lastModified: '2024-11-20T10:46:19.440Z',
    },
    {
      schema: {
        properties: {
          optIn: {
            properties: {
              acceptanceLocation: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      topicChannelId: 'C_SMS',
      channel: 'SMS',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:38.858Z',
    },
  ],
  objectsCount: 6,
  totalCount: 6,
}
export const expectedCleanCommunicationResponse = {
  communications: {
    0: {
      topicChannelId: 'C_Email',
      channel: 'Email',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:37.688Z',
    },
    1: {
      topicChannelId: 'T_Email',
      channel: 'Email',
      topic: 'transactional',
      description: '',
      lastModified: '2024-11-20T10:46:18.726Z',
    },
    2: {
      schema: {
        properties: {
          optIn: {
            properties: {
              acceptanceLocation: {
                type: 'string',
              },
              sourceApplication: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      topicChannelId: 'C_mobileApp',
      channel: 'mobileApp',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:38.326Z',
    },
    3: {
      topicChannelId: 'C_whatsApp',
      channel: 'whatsApp',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:39.422Z',
    },
    4: {
      topicChannelId: 'T_SMS',
      channel: 'SMS',
      topic: 'transactional',
      description: '',
      lastModified: '2024-11-20T10:46:19.440Z',
    },
    5: {
      schema: {
        properties: {
          optIn: {
            properties: {
              acceptanceLocation: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      topicChannelId: 'C_SMS',
      channel: 'SMS',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:38.858Z',
    },
  },
}

export const expectedTransformedCommunicationData = [
  {
    id: 'communications',
    name: 'communications',
    value: false,
    branches: [
      {
        id: 'C_Email',
        name: 'C_Email',
        value: false,
        branches: [
          {
            id: 'communications.C_Email.status',
            name: 'status',
            value: false,
            branches: [],
          },
        ],
      },
      {
        id: 'T_Email',
        name: 'T_Email',
        value: false,
        branches: [
          {
            id: 'communications.T_Email.status',
            name: 'status',
            value: false,
            branches: [],
          },
        ],
      },
      {
        id: 'C_mobileApp',
        name: 'C_mobileApp',
        value: false,
        branches: [
          {
            id: 'communications.C_mobileApp.status',
            name: 'status',
            value: false,
            branches: [],
          },
          {
            id: 'communications.C_mobileApp.optIn.acceptanceLocation',
            name: 'acceptanceLocation',
            value: false,
            branches: [],
          },
          {
            id: 'communications.C_mobileApp.optIn.sourceApplication',
            name: 'sourceApplication',
            value: false,
            branches: [],
          },
        ],
      },
      {
        id: 'C_whatsApp',
        name: 'C_whatsApp',
        value: false,
        branches: [
          {
            id: 'communications.C_whatsApp.status',
            name: 'status',
            value: false,
            branches: [],
          },
        ],
      },
      {
        id: 'T_SMS',
        name: 'T_SMS',
        value: false,
        branches: [
          {
            id: 'communications.T_SMS.status',
            name: 'status',
            value: false,
            branches: [],
          },
        ],
      },
      {
        id: 'C_SMS',
        name: 'C_SMS',
        value: false,
        branches: [
          {
            id: 'communications.C_SMS.status',
            name: 'status',
            value: false,
            branches: [],
          },
          {
            id: 'communications.C_SMS.optIn.acceptanceLocation',
            name: 'acceptanceLocation',
            value: false,
            branches: [],
          },
        ],
      },
    ],
  },
]

export const expectedGetCommunicationsData = {
  communications: {
    0: {
      topicChannelId: 'C_Email',
      channel: 'Email',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:37.688Z',
    },
    1: {
      topicChannelId: 'T_Email',
      channel: 'Email',
      topic: 'transactional',
      description: '',
      lastModified: '2024-11-20T10:46:18.726Z',
    },
    2: {
      schema: {
        properties: {
          optIn: {
            properties: {
              acceptanceLocation: {
                type: 'string',
              },
              sourceApplication: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      topicChannelId: 'C_mobileApp',
      channel: 'mobileApp',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:38.326Z',
    },
    3: {
      topicChannelId: 'C_whatsApp',
      channel: 'whatsApp',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:39.422Z',
    },
    4: {
      topicChannelId: 'T_SMS',
      channel: 'SMS',
      topic: 'transactional',
      description: '',
      lastModified: '2024-11-20T10:46:19.440Z',
    },
    5: {
      schema: {
        properties: {
          optIn: {
            properties: {
              acceptanceLocation: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      topicChannelId: 'C_SMS',
      channel: 'SMS',
      topic: 'marketing',
      description: '',
      lastModified: '2024-12-09T07:42:38.858Z',
    },
  },
}
