/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
/* eslint-disable no-template-curly-in-string */
import { commonError, commonErrorResponse, commonSteps, commonTransformCDCStructure } from './commonData'
export const importFullAccountAzure = {
  name: '{{dataflowName}}',
  status: 'published',
  description: 'Import Full Account - Toolkit',
  steps: [
    ...commonTransformCDCStructure('loginIds'),
    ...commonSteps,
    {
      id: 'Subscriptions',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogICAgLy8gQ29udmVydHMgaW5wdXQ6ICJzdWJzY3JpcHRpb25zLm5ld3NsZXR0ZXIuY29tbWVyY2lhbC5pc1N1YnNjcmliZWQiOiJUUlVFIg0KICAgIC8vIHRvIG91dHB1dDogeyJzdWJzY3JpcHRpb25zIjogeyJuZXdzbGV0dGVyIjp7ImNvbW1lcmNpYWwiOnsiZW1haWwiOnsiaXNTdWJzY3JpYmVkIjoiVFJVRSJ9fX19fQ0KDQogICAgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eSgic3Vic2NyaXB0aW9ucyIpKSB7DQogICAgICAgIHJlY29yZC5zdWJzY3JpcHRpb25zID0gYWRkRW1haWxCZWZvcmVJc1N1YnNjcmliZWQocmVjb3JkLnN1YnNjcmlwdGlvbnMpOw0KICAgICAgICBsb2dnZXIuaW5mbygiVHJhbnNmb3JtZWQgU3Vic2NyaXB0aW9ucyIsIHJlY29yZC5zdWJzY3JpcHRpb25zKTsNCiAgICB9DQoNCiAgICByZXR1cm4gcmVjb3JkOw0KfQ0KDQpmdW5jdGlvbiBhZGRFbWFpbEJlZm9yZUlzU3Vic2NyaWJlZChvYmopIHsNCiAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb24gdG8gdHJhdmVyc2UgYW5kIGZpbmQgdGhlIG9iamVjdCB3aXRoICJpc1N1YnNjcmliZWQiDQogICAgZnVuY3Rpb24gdHJhdmVyc2Uobm9kZSkgew0KICAgICAgICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnIHx8IG5vZGUgPT09IG51bGwpIHJldHVybjsNCg0KICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobm9kZSk7DQoNCiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgbm9kZSBoYXMgImlzU3Vic2NyaWJlZCIga2V5DQogICAgICAgIGlmIChrZXlzLmluY2x1ZGVzKCJpc1N1YnNjcmliZWQiKSkgew0KICAgICAgICAgICAgY29uc3QgY29weSA9IHsNCiAgICAgICAgICAgICAgICAuLi5ub2RlDQogICAgICAgICAgICB9Ow0KDQogICAgICAgICAgICAvLyBDbGVhciB0aGUgY3VycmVudCBvYmplY3QgYW5kIHdyYXAgaXQgd2l0aCAiZW1haWwiDQogICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7DQogICAgICAgICAgICAgICAgZGVsZXRlIG5vZGVba2V5XTsNCiAgICAgICAgICAgIH0NCg0KICAgICAgICAgICAgbm9kZS5lbWFpbCA9IGNvcHk7DQogICAgICAgICAgICByZXR1cm47DQogICAgICAgIH0NCg0KICAgICAgICAvLyBSZWN1cnNpdmVseSB0cmF2ZXJzZSB0aGUgY2hpbGQgbm9kZXMNCiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykgew0KICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlW2tleV0gPT09ICdvYmplY3QnICYmIG5vZGVba2V5XSAhPT0gbnVsbCkgew0KICAgICAgICAgICAgICAgIHRyYXZlcnNlKG5vZGVba2V5XSk7DQogICAgICAgICAgICB9DQogICAgICAgIH0NCiAgICB9DQoNCiAgICAvLyBTdGFydCB0cmF2ZXJzYWwgZnJvbSB0aGUgcm9vdCBvYmplY3QNCiAgICB0cmF2ZXJzZShvYmopOw0KDQogICAgcmV0dXJuIG9iajsNCn0=',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['If UID is Present', 'If UID Is Not Present'],
    },
    {
      id: 'Account lookup using UID',
      type: 'datasource.lookup.gigya.account',
      params: {
        select: 'UID',
        handleFieldConflicts: 'take_lookup',
        mismatchBehavior: 'error',
        lookupFields: [
          {
            sourceField: 'uid',
            gigyaField: 'UID',
          },
        ],
        lookupFieldsOperator: 'OR',
        matchBehavior: 'process',
        isCaseSensitive: false,
        maxConcurrency: 1,
        from: 'accounts',
        batchSize: 200,
        multiMatchBehavior: 'error',
        separateMultiMatches: false,
      },
      next: ['Handle UID'],
      error: ['Lookup Failed'],
    },
    {
      id: 'Handle UID',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgICBsZXQgVUlEOw0KICAgIGxldCByZXF1ZXN0ID0ge307DQoNCiAgICBpZiAocmVjb3JkLlVJRCkgew0KICAgICAgICBVSUQgPSByZWNvcmQuVUlEOw0KICAgIH0gZWxzZSB7DQogICAgICAgIFVJRCA9ICd4eHh4eHh4eHh4eHg0eHh4eXh4eHh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7DQogICAgICAgICAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDAsDQogICAgICAgICAgICAgICAgdiA9IGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KTsNCiAgICAgICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTsNCiAgICAgICAgfSk7DQogICAgfQ0KICAgIHJlY29yZC51aWQgPSBVSUQ7DQogICAgZGVsZXRlIHJlY29yZC5VSUQ7DQoNCiAgICByZXR1cm4gcmVjb3JkOw0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Handle unsupported schema'],
    },
    ...commonError,
    {
      id: 'setAccountInfo',
      type: 'datasource.write.gigya.generic',
      params: {
        apiMethod: 'accounts.setAccountInfo',
        maxConnections: 10,
        addResponse: true,
        apiParams: [
          {
            sourceField: '_response.UID',
            paramName: 'uid',
            value: '',
          },
          {
            sourceField: 'context',
            paramName: 'context',
            value: '',
          },
          {
            sourceField: 'addresses',
            paramName: 'addresses',
            value: '',
          },
          {
            sourceField: 'internal',
            paramName: 'internal',
            value: '',
          },
          {
            sourceField: 'customIdentifiers',
            paramName: 'customIdentifiers',
            value: '',
          },
        ],
      },
      next: ['Set Account Response'],
      error: ['Set Account Error Response'],
    },
    {
      id: 'gigya.importaccount',
      type: 'datasource.write.gigya.importaccount',
      params: {
        importPolicy: 'upsert',
        maxConnections: 20,
        addResponse: true,
      },
      next: ['Import Account Success Response'],
      error: ['Import Account Error Response'],
    },
    {
      id: 'Import Account Success Response',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgICByZXR1cm4gcmVjb3JkOw0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Restore unsupported schemas'],
    },
    ...commonErrorResponse,
    {
      id: 'Import Account Request Logger',
      type: 'record.evaluate',
      params: {
        script: 'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IFJlcXVlc3QiLCByZWNvcmQpOw0KICAgIHJldHVybiByZWNvcmQ7DQp9',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['gigya.importaccount'],
    },
    {
      id: 'Set Account Error Response',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgIGxvZ2dlci5pbmZvKCJTZXQgQWNjb3VudCBFcnJvciBSZXNwb25zZSIsIHJlY29yZCk7DQogICByZXR1cm4gcmVjb3JkOw0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Error File'],
    },
    {
      id: 'Set Account Response',
      type: 'record.evaluate',
      params: {
        script: 'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIlNldCBBY2NvdW50IFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgcmV0dXJuIHJlY29yZDsNCn0=',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Success File'],
    },
    {
      id: 'loginIds',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgICAvLyBjb252ZXJ0cyBpbnB1dDogImxvZ2luSWRzLnVzZXJuYW1lIjoiVVMxMDEiLCJsb2dpbklkcy5lbWFpbHMiOiJ0ZXN0MUBtYWlsLmNvbSIsImxvZ2luSWRzLnVudmVyaWZpZWRFbWFpbHMiOiIiDQogICAgLy8gdG8gb3V0cHV0OiB7InVzZXJuYW1lIjoiVVMxMDEiLCJlbWFpbHMiOlsidGVzdDFAbWFpbC5jb20iXSwidW52ZXJpZmllZEVtYWlscyI6W119DQoNCiAgICBpZiAocmVjb3JkPy5sb2dpbklkcz8uZW1haWxzICE9PSB1bmRlZmluZWQpIHsNCiAgICAgICAgcmVjb3JkLmxvZ2luSWRzLmVtYWlscyA9IHJlY29yZC5sb2dpbklkcy5lbWFpbHMudHJpbSgpICE9PSAnJyA/DQogICAgICAgICAgICByZWNvcmQubG9naW5JZHMuZW1haWxzLnNwbGl0KCcsJykubWFwKGVtYWlsID0+IGVtYWlsLnRyaW0oKSkgOg0KICAgICAgICAgICAgW107DQogICAgfQ0KDQogICAgLy8gSGFuZGxlICJ1bnZlcmlmaWVkRW1haWxzIiBmaWVsZDogQ29udmVydCB0byBhcnJheSBvciBzZXQgYXMgZW1wdHkgYXJyYXkgaWYgaXQncyBhbiBlbXB0eSBzdHJpbmcNCiAgICBpZiAocmVjb3JkPy5sb2dpbklkcz8udW52ZXJpZmllZEVtYWlscyAhPT0gdW5kZWZpbmVkKSB7DQogICAgICAgIHJlY29yZC5sb2dpbklkcy51bnZlcmlmaWVkRW1haWxzID0gcmVjb3JkLmxvZ2luSWRzLnVudmVyaWZpZWRFbWFpbHMudHJpbSgpICE9PSAnJyA/DQogICAgICAgICAgICByZWNvcmQubG9naW5JZHMudW52ZXJpZmllZEVtYWlscy5zcGxpdCgnLCcpLm1hcChlbWFpbCA9PiBlbWFpbC50cmltKCkpIDoNCiAgICAgICAgICAgIFtdOw0KICAgIH0NCg0KICAgIC8vIEhhbmRsZSAidXNlcm5hbWUiIGZpZWxkOiBTZXQgdG8gbnVsbCBpZiBpdCdzIGFuIGVtcHR5IHN0cmluZw0KICAgIGlmIChyZWNvcmQ/LmxvZ2luSWRzPy51c2VybmFtZSA9PT0gJycpIHsNCiAgICAgICAgcmVjb3JkLmxvZ2luSWRzLnVzZXJuYW1lID0gbnVsbDsNCiAgICB9DQoNCiAgICBsb2dnZXIuaW5mbygibG9naW5JZHMiLCByZWNvcmQubG9naW5JZHMpOw0KICAgIHJldHVybiByZWNvcmQ7DQp9',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Subscriptions'],
    },
    {
      id: 'Success File',
      type: 'file.format.dsv',
      params: {
        fileName: 'Success_importFullAccount_${now}.csv',
        columnSeparator: ',',
        escapeCharacter: '\\',
        maxFileSize: 10,
        writeHeader: true,
        dsvFormatVersion: 'Standard',
        lineEnd: '\n',
        quoteFields: false,
        createEmptyFile: false,
      },
      next: ['Write to Azure Blobs'],
    },
    {
      id: 'Handle unsupported schema',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7CiAgLy8gRW5zdXJlIGBjb250ZXh0YCBleGlzdHMgYW5kIGlzIHByb3Blcmx5IG5lc3RlZAogIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkoJ2NvbnRleHQnKSkgewogICAgcmVjb3JkLmNvbnRleHQgPSB7IGNvbnRleHQ6IHJlY29yZC5jb250ZXh0IH07CiAgfSBlbHNlIGlmICghcmVjb3JkLmhhc093blByb3BlcnR5KCdjb250ZXh0JykpIHsKICAgIHJlY29yZC5jb250ZXh0ID0ge307CiAgfQoKICAvLyBNb3ZlIHNwZWNpZmljIHByb3BlcnRpZXMgdG8gdGhlIGNvbnRleHQgb2JqZWN0CiAgbW92ZVByb3BlcnR5KHJlY29yZCwgcmVjb3JkLmNvbnRleHQsICdjdXN0b21JZGVudGlmaWVycycpOwogIG1vdmVQcm9wZXJ0eShyZWNvcmQsIHJlY29yZC5jb250ZXh0LCAnYWRkcmVzc2VzJyk7CiAgbW92ZVByb3BlcnR5KHJlY29yZCwgcmVjb3JkLmNvbnRleHQsICdpbnRlcm5hbCcpOwoKICByZXR1cm4gcmVjb3JkOwp9CgpmdW5jdGlvbiBtb3ZlUHJvcGVydHkocmVjb3JkLCB0YXJnZXQsIHByb3BlcnR5TmFtZSkgewogIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkgewogICAgLy8gTW92ZSB0aGUgcHJvcGVydHkgdG8gdGhlIHRhcmdldCBvYmplY3QKICAgIHRhcmdldFtwcm9wZXJ0eU5hbWVdID0gcmVjb3JkW3Byb3BlcnR5TmFtZV07CiAgICAvLyBEZWxldGUgdGhlIHByb3BlcnR5IGZyb20gdGhlIG9yaWdpbmFsIHJlY29yZAogICAgZGVsZXRlIHJlY29yZFtwcm9wZXJ0eU5hbWVdOwogIH0KfQo=',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Import Account Request Logger'],
    },
    {
      id: 'Restore unsupported schemas',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7CiAgLy8gTW92ZSBgY29udGV4dC5jb250ZXh0YCB0byBgcmVjb3JkLmNvbnRleHRgIGlmIHByZXNlbnQKICBtb3ZlQ29udGV4dChyZWNvcmQpOwoKICAvLyBNb3ZlIHNwZWNpZmljIHByb3BlcnRpZXMgZnJvbSB0aGUgY29udGV4dCBvYmplY3QgdG8gdGhlIHJlY29yZAogIG1vdmVQcm9wZXJ0eShyZWNvcmQsICdhZGRyZXNzZXMnKTsKICBtb3ZlUHJvcGVydHkocmVjb3JkLCAnaW50ZXJuYWwnKTsKICBtb3ZlUHJvcGVydHkocmVjb3JkLCAnY3VzdG9tSWRlbnRpZmllcnMnKTsKICAKICByZXR1cm4gcmVjb3JkOwp9CgovLyBIZWxwZXIgZnVuY3Rpb24gdG8gbW92ZSBhIHByb3BlcnR5IGZyb20gdGhlIGNvbnRleHQgb2JqZWN0IHRvIHRoZSByZWNvcmQsIHdpdGggYSBkZWZhdWx0IHZhbHVlIGlmIG5vdCBwcmVzZW50CmZ1bmN0aW9uIG1vdmVQcm9wZXJ0eShyZWNvcmQsIHByb3BlcnR5TmFtZSkgewogIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkoJ19yZXNwb25zZScpICYmIAogICAgICByZWNvcmQuX3Jlc3BvbnNlLmhhc093blByb3BlcnR5KCdjb250ZXh0JykpIHsKICAgIGNvbnN0IGNvbnRleHQgPSByZWNvcmQuX3Jlc3BvbnNlLmNvbnRleHQ7CgogICAgLy8gUGFyc2UgY29udGV4dCBpZiBpdCBpcyBhIHN0cmluZyAoaW4gY2FzZSBpdCdzIGEgSlNPTiBzdHJpbmcpCiAgICBsZXQgcGFyc2VkQ29udGV4dCA9IGNvbnRleHQ7CiAgICBpZiAodHlwZW9mIGNvbnRleHQgPT09ICdzdHJpbmcnKSB7CiAgICAgIHRyeSB7CiAgICAgICAgcGFyc2VkQ29udGV4dCA9IEpTT04ucGFyc2UoY29udGV4dCk7CiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7CiAgICAgICAgY29uc29sZS5lcnJvcigiRXJyb3IgcGFyc2luZyBjb250ZXh0OiIsIGVycm9yKTsKICAgICAgICBwYXJzZWRDb250ZXh0ID0ge307ICAvLyBEZWZhdWx0IHRvIGVtcHR5IG9iamVjdCBpZiBwYXJzaW5nIGZhaWxzCiAgICAgIH0KICAgIH0KCiAgICAvLyBJZiB0aGUgcHJvcGVydHkgZXhpc3RzLCBtb3ZlIGl0IHRvIHRoZSB0b3AtbGV2ZWwgcmVjb3JkCiAgICAvLyBPdGhlcndpc2UsIHNldCBpdCB0byBhbiBlbXB0eSBvYmplY3QgYXMgYSBkZWZhdWx0CiAgICByZWNvcmRbcHJvcGVydHlOYW1lXSA9IHBhcnNlZENvbnRleHQuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSA/IHBhcnNlZENvbnRleHRbcHJvcGVydHlOYW1lXSA6IHt9OwogIH0KfQoKLy8gRnVuY3Rpb24gdG8gbW92ZSBgY29udGV4dC5jb250ZXh0YCB0byBgcmVjb3JkLmNvbnRleHRgIGlmIHByZXNlbnQKZnVuY3Rpb24gbW92ZUNvbnRleHQocmVjb3JkKSB7CiAgaWYgKHJlY29yZC5oYXNPd25Qcm9wZXJ0eSgnX3Jlc3BvbnNlJykgJiYgCiAgICAgIHJlY29yZC5fcmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ2NvbnRleHQnKSkgewogICAgbGV0IGNvbnRleHQgPSByZWNvcmQuX3Jlc3BvbnNlLmNvbnRleHQ7CgogICAgLy8gUGFyc2UgY29udGV4dCBpZiBpdCBpcyBhIHN0cmluZwogICAgaWYgKHR5cGVvZiBjb250ZXh0ID09PSAnc3RyaW5nJykgewogICAgICB0cnkgewogICAgICAgIGNvbnRleHQgPSBKU09OLnBhcnNlKGNvbnRleHQpOwogICAgICB9IGNhdGNoIChlcnJvcikgewogICAgICAgIGNvbnNvbGUuZXJyb3IoIkVycm9yIHBhcnNpbmcgY29udGV4dDoiLCBlcnJvcik7CiAgICAgICAgY29udGV4dCA9IHt9OyAgLy8gRGVmYXVsdCB0byBlbXB0eSBvYmplY3QgaWYgcGFyc2luZyBmYWlscwogICAgICB9CiAgICB9CgogICAgLy8gSWYgYGNvbnRleHQuY29udGV4dGAgZXhpc3RzLCBtb3ZlIGl0IHRvIGByZWNvcmQuY29udGV4dGAKICAgIGlmIChjb250ZXh0Lmhhc093blByb3BlcnR5KCdjb250ZXh0JykpIHsKICAgICAgcmVjb3JkLmNvbnRleHQgPSBjb250ZXh0LmNvbnRleHQ7CiAgICB9IGVsc2UgewogICAgICAvLyBJZiBgY29udGV4dC5jb250ZXh0YCBpcyBub3QgcHJlc2VudCwgc2V0IHJlY29yZC5jb250ZXh0IGFzIGVtcHR5IG9iamVjdAogICAgICByZWNvcmQuY29udGV4dCA9IHt9OwogICAgfQogIH0KfQo=',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['setAccountInfo'],
    },
    {
      id: 'Lookup Failed',
      type: 'record.evaluate',
      params: {
        script: 'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkxvb2t1cCBmYWlsZWQgcmVzcG9uc2UiLCByZWNvcmQpOw0KICByZXR1cm4gcmVjb3JkOw0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Error File'],
      error: [],
    },
    {
      id: 'If UID is Present',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogICAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIGxvb2t1cCBzaG91bGQgYmUgY2FsbGVkIGJhc2VkIG9uIFVJRCB2YWx1ZQ0KDQogICAgaWYgKHJlY29yZC51aWQgJiYgcmVjb3JkLnVpZC50cmltKCkgIT09ICcnKSB7DQogICAgICAgIC8vIFVJRCBoYXMgdmFsdWUuIEV4ZWN1dGUgbG9va3VwDQogICAgICAgIGxvZ2dlci5pbmZvKCJBY2NvdW50IExvb2t1cCBSZXF1ZXN0IFVJRDogIiwgcmVjb3JkLnVpZCk7DQogICAgICAgIHJldHVybiByZWNvcmQ7DQogICAgfQ0KICAgIHJldHVybiBudWxsOyAvLyBVSUQgaXMgQmxhbmsuIFNraXAgTG9va3VwLg0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Account lookup using UID'],
    },
    {
      id: 'If UID Is Not Present',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogICAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIGxvb2t1cCBzaG91bGQgYmUgc2tpcHBlZCBiYXNlZCBvbiBVSUQgdmFsdWUNCiAgICBpZiAoIXJlY29yZC51aWQgfHwgcmVjb3JkLnVpZC50cmltKCkgPT09ICcnKSB7DQogICAgICAgIC8vIFVJRCBpcyBlaXRoZXIgbm90IHByZXNlbnQgb3IgYmxhbmsuIFNraXAgbG9va3VwLg0KICAgICAgICByZXR1cm4gcmVjb3JkOw0KICAgIH0NCiAgICByZXR1cm4gbnVsbDsgLy8gVUlEIGhhcyB2YWx1ZS4gRXhlY3V0ZSBsb29rdXAgZWxzZXdoZXJlLg0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Handle UID'],
    },
  ],
  version: 1,
}
