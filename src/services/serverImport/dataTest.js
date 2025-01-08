export const scheduleResponse = {
  callId: '17d68ed0c00d4acf91004c0da188adf6',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2025-01-08T17:15:19.344Z',
  id: '56b5d528ed824da59bd325e848f04986',
}

export const commonConfigurations = {
  azure: [
    {
      id: '{{dataflowName}}',
      name: 'Dataflow Name *',
      type: 'text',
      placeholder: 'Enter your Dataflow Name',
      tooltip: 'The name of the dataflow.',
      value: 'asd',
    },
  ],
}

export const commonOption = { option: 'azure' }

export const expectedScheduleStructure = {
  data: {
    name: 'server_import_scheduler',
    dataflowId: 'dataflowId',
    frequencyType: 'once',
    fullExtract: true,
  },
}
