/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { communicationsBranches } from '../mainDataSet'
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

export const expectedTransformedCommunicationData = [{ id: 'communications', name: 'communications', value: false, branches: communicationsBranches }]
