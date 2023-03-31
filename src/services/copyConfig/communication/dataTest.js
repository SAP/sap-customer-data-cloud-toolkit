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
  CommunicationSettings: {
    NoTax_SMS: {
      isActive: true,
      description: 'day without tax',
      lastModified: '2023-03-29T13:23:27.4668165Z',
      channel: 'SMS',
      topic: 'NoTax',
      dependsOn: ['phoneNumber'],
    },
    NoTax_WiFi: {
      isActive: true,
      description: 'day without tax',
      lastModified: '2023-03-29T13:23:27.4668161Z',
      channel: 'WiFi',
      topic: 'NoTax',
      dependsOn: ['firstName'],
    },
  },
}

export function getNoChannelsExpectedResponse() {
  const response = JSON.parse(JSON.stringify(channelsExpectedResponse))
  response.Channels = {}
  return response
}


// export const channel = {
//     "callId": "3bd8cd0e4d494aac8fd29542eaf2e7a1",
//     "errorCode": 400009,
//     "errorDetails": "Setting channels is prohibited on child site.",
//     "errorMessage": "Validation error",
//     "apiVersion": 2,
//     "statusCode": 400,
//     "statusReason": "Bad Request",
//     "time": "2023-03-29T14:32:19.580Z"
// }
//
// export const topic = {
//     "callId": "de80a0d270d641118ebd5c5ddf3f2b36",
//     "errorCode": 400009,
//     "errorDetails": "NoIva_WiFi : Only IsActive can modified in child site.",
//     "errorMessage": "Validation error",
//     "apiVersion": 2,
//     "statusCode": 400,
//     "statusReason": "Bad Request",
//     "time": "2023-03-29T14:43:15.199Z"
// }
