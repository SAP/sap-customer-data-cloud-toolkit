/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const channelsExpectedResponse = {
  callId: '18c123bde80c4e989d95c98718cb1b9f',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-03-29T13:23:51.093Z',
  Channels: {
    SMS: {
      dependsOn: [
        {
          fieldID: 'phoneNumber',
          required: true,
        },
      ],
      description: 'You can send SMS campaigns via this preconfigured channel',
    },
    WiFi: {
      dependsOn: [
        {
          fieldID: 'firstName',
          required: true,
        },
      ],
      description: 'You can send campaigns using WiFi',
    },
  },
}
export const topicsExpectedResponse = {
  callId: 'dd9d17c5c14040d8b6302cb0d38ffc29',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-03-29T13:24:09.547Z',
  results: [
    {
      topicChannelId: 'Test_email',
      channel: 'Email',
      topic: 'test_turn2',
      description: 'Test description email',
      lastModified: '2024-07-08T14:48:48.397Z',
    },
    {
      topicChannelId: 'Test_SMS',
      channel: 'Testes_sms',
      topic: 'test2',
      description: 'Test description SMS',
      lastModified: '2024-07-08T14:48:48.376Z',
    },
  ],
}

export const errorResponse = {
  callId: 'dd9d17c5c14040d8b6302cb0d38ffc29',
  errorCode: 10000,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-03-29T13:24:09.547Z',
}

export function getNoChannelsExpectedResponse() {
  const response = JSON.parse(JSON.stringify(channelsExpectedResponse))
  response.Channels = {}
  return response
}
