export const importFullAccountAzure = {
  name: '{{dataflowName}}',
  description: 'Import Full Account - Toolkit',
  status: 'published',
  steps: [
    {
      id: 'Transform to CDC Structure',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgICBsb2dnZXIuaW5mbygiSW5wdXQgUGF5bG9hZCIsIHJlY29yZCk7DQoNCiAgICBsZXQgcmVzdWx0ID0ge307DQoNCiAgICBmb3IgKGxldCBrZXkgaW4gcmVjb3JkKSB7DQogICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkoa2V5KSkgew0KICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByZWNvcmRba2V5XTsNCiAgICAgICAgICAgIGNvbnN0IGtleXNBcnJheSA9IGtleS5zcGxpdCgnLicpOw0KDQogICAgICAgICAgICBjb25zdCBuZXN0ZWRPYmplY3QgPSBidWlsZE5lc3RlZE9iamVjdChrZXlzQXJyYXksIHZhbHVlKTsNCiAgICAgICAgICAgIHJlc3VsdCA9IG1lcmdlRGVlcChyZXN1bHQsIG5lc3RlZE9iamVjdCk7DQogICAgICAgIH0NCiAgICB9DQoNCiAgICBsb2dnZXIuaW5mbygiVHJhbnNmb3JtZWQgUGF5bG9hZCIsIHJlc3VsdCk7DQogICAgcmV0dXJuIHJlc3VsdDsNCn0NCg0KZnVuY3Rpb24gYnVpbGROZXN0ZWRPYmplY3Qoa2V5cywgdmFsdWUpIHsNCiAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb24gdG8gYnVpbGQgYSBuZXN0ZWQgb2JqZWN0IG9yIGFycmF5DQogICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7DQogICAgICAgIHJldHVybiB7DQogICAgICAgICAgICBba2V5c1swXV06IHZhbHVlDQogICAgICAgIH07DQogICAgfQ0KDQogICAgY29uc3Qga2V5ID0ga2V5c1swXTsNCiAgICBjb25zdCBuZXh0S2V5ID0ga2V5c1sxXTsNCg0KICAgIC8vIElmIG5leHQga2V5IGlzIGEgbnVtYmVyLCB0cmVhdCBpdCBhcyBhbiBhcnJheQ0KICAgIGlmICghaXNOYU4ocGFyc2VJbnQobmV4dEtleSkpKSB7DQogICAgICAgIGxldCBhcnIgPSBbXTsNCiAgICAgICAgYXJyW3BhcnNlSW50KG5leHRLZXkpXSA9IGJ1aWxkTmVzdGVkT2JqZWN0KGtleXMuc2xpY2UoMiksIHZhbHVlKTsNCiAgICAgICAgcmV0dXJuIHsNCiAgICAgICAgICAgIFtrZXldOiBhcnINCiAgICAgICAgfTsNCiAgICB9DQoNCiAgICByZXR1cm4gew0KICAgICAgICBba2V5XTogYnVpbGROZXN0ZWRPYmplY3Qoa2V5cy5zbGljZSgxKSwgdmFsdWUpDQogICAgfTsNCn0NCg0KZnVuY3Rpb24gbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7DQogICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIG1lcmdlIG5lc3RlZCBvYmplY3RzIG9yIGFycmF5cw0KICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHsNCiAgICAgICAgaWYgKHNvdXJjZVtrZXldIGluc3RhbmNlb2YgT2JqZWN0ICYmIGtleSBpbiB0YXJnZXQpIHsNCiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldFtrZXldKSAmJiBBcnJheS5pc0FycmF5KHNvdXJjZVtrZXldKSkgew0KICAgICAgICAgICAgICAgIC8vIE1lcmdlIGFycmF5cyBieSBpbmRleCwgbWFraW5nIHN1cmUgdG8gYXZvaWQgbnVsbCB2YWx1ZXMNCiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHRhcmdldFtrZXldLm1hcCgoaXRlbSwgaW5kZXgpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZCA/IG1lcmdlRGVlcChpdGVtLCBzb3VyY2Vba2V5XVtpbmRleF0pIDogc291cmNlW2tleV1baW5kZXhdOw0KICAgICAgICAgICAgICAgIH0pLmNvbmNhdChzb3VyY2Vba2V5XS5zbGljZSh0YXJnZXRba2V5XS5sZW5ndGgpKTsNCiAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzb3VyY2Vba2V5XSwgbWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSkpOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsNCiAgICAgICAgfQ0KICAgIH0NCiAgICByZXR1cm4gdGFyZ2V0Ow0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['loginIds'],
    },
    {
      id: 'azure.blob',
      type: 'datasource.read.azure.blob',
      params: {
        accountName: '{{accountName}}',
        accountKey: '{{accountKey}}',
        container: '{{container}}',
        fileNameRegex: '{{readFileNameRegex}}',
        blobPrefix: '{{blobPrefix}}',
      },
      next: ['file.parse.dsv'],
    },
    {
      id: 'file.parse.dsv',
      type: 'file.parse.dsv',
      params: {
        columnSeparator: ',',
        fileCharset: 'UTF-8',
        inferTypes: false,
        addFilename: false,
      },
      next: ['Transform to CDC Structure'],
    },
    {
      id: 'Subscriptions',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkoInN1YnNjcmlwdGlvbnMiKSkgew0KICAgIHJlY29yZC5zdWJzY3JpcHRpb25zID0gYWRkRW1haWxCZWZvcmVJc1N1YnNjcmliZWQocmVjb3JkLnN1YnNjcmlwdGlvbnMpOw0KICAgIGxvZ2dlci5pbmZvKCJUcmFuc2Zvcm1lZCBTdWJzY3JpcHRpb25zIiwgcmVjb3JkLnN1YnNjcmlwdGlvbnMpOw0KICB9DQoNCiAgcmV0dXJuIHJlY29yZDsNCn0NCg0KZnVuY3Rpb24gYWRkRW1haWxCZWZvcmVJc1N1YnNjcmliZWQob2JqKSB7DQogIC8vIFJlY3Vyc2l2ZSBmdW5jdGlvbiB0byB0cmF2ZXJzZSBhbmQgZmluZCB0aGUgb2JqZWN0IHdpdGggImlzU3Vic2NyaWJlZCINCiAgZnVuY3Rpb24gdHJhdmVyc2Uobm9kZSkgew0KICAgIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcgfHwgbm9kZSA9PT0gbnVsbCkgcmV0dXJuOw0KDQogICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUpOw0KDQogICAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgbm9kZSBoYXMgImlzU3Vic2NyaWJlZCIga2V5DQogICAgaWYgKGtleXMuaW5jbHVkZXMoImlzU3Vic2NyaWJlZCIpKSB7DQogICAgICBjb25zdCBjb3B5ID0geyAuLi5ub2RlIH07DQoNCiAgICAgIC8vIENsZWFyIHRoZSBjdXJyZW50IG9iamVjdCBhbmQgd3JhcCBpdCB3aXRoICJlbWFpbCINCiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHsNCiAgICAgICAgZGVsZXRlIG5vZGVba2V5XTsNCiAgICAgIH0NCg0KICAgICAgbm9kZS5lbWFpbCA9IGNvcHk7DQogICAgICByZXR1cm47DQogICAgfQ0KDQogICAgLy8gUmVjdXJzaXZlbHkgdHJhdmVyc2UgdGhlIGNoaWxkIG5vZGVzDQogICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykgew0KICAgICAgaWYgKHR5cGVvZiBub2RlW2tleV0gPT09ICdvYmplY3QnICYmIG5vZGVba2V5XSAhPT0gbnVsbCkgew0KICAgICAgICB0cmF2ZXJzZShub2RlW2tleV0pOw0KICAgICAgfQ0KICAgIH0NCiAgfQ0KDQogIC8vIFN0YXJ0IHRyYXZlcnNhbCBmcm9tIHRoZSByb290IG9iamVjdA0KICB0cmF2ZXJzZShvYmopOw0KDQogIHJldHVybiBvYmo7DQp9DQo=',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Account lookup using UID'],
    },
    {
      id: 'Account lookup using UID',
      type: 'datasource.lookup.gigya.account',
      params: {
        select: 'UID as _UID',
        handleFieldConflicts: 'take_lookup',
        mismatchBehavior: 'process',
        lookupFields: [
          {
            sourceField: 'uid',
            gigyaField: 'UID',
          },
        ],
        lookupFieldsOperator: 'OR',
        matchBehavior: 'process',
        isCaseSensitive: true,
        maxConcurrency: 1,
        from: 'accounts',
        batchSize: 200,
        multiMatchBehavior: 'error',
        separateMultiMatches: true,
      },
      next: ['record.evaluate - UID'],
    },
    {
      id: 'record.evaluate - UID',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogICAgbG9nZ2VyLmluZm8oIlJlc3BvbnNlIG9mIEFjY291bnQgbG9va3VwIHVzaW5nIFVJRCIsIHJlY29yZCk7DQoNCiAgICBsZXQgVUlEOw0KICAgIGxldCByZXF1ZXN0ID0ge307DQoNCiAgICBpZiAocmVjb3JkLl9VSUQpIHsNCiAgICAgICAgVUlEID0gcmVjb3JkLl9VSUQ7DQogICAgfSBlbHNlIHsNCiAgICAgICAgVUlEID0gJ3h4eHh4eHh4eHh4eDR4eHh5eHh4eHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHsNCiAgICAgICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCwNCiAgICAgICAgICAgICAgICB2ID0gYyA9PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpOw0KICAgICAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpOw0KICAgICAgICB9KTsNCiAgICB9DQogICAgcmVjb3JkLnVpZCA9IFVJRDsNCiAgICBkZWxldGUgcmVjb3JkLlVJRDsNCiAgICAvLyByZXF1ZXN0LlVJRCA9IFVJRDsgDQoNCiAgICAvLyByZWNvcmQucmVxdWVzdCA9IHJlcXVlc3Q7DQogIA0KICAgIHJldHVybiByZWNvcmQ7DQp9',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Handle unsupported schema'],
    },
    {
      id: 'Error File',
      type: 'file.format.dsv',
      params: {
        fileName: 'Error_FullAccount_Upload_${now}.csv',
        columnSeparator: ',',
        escapeCharacter: '\\',
        maxFileSize: 1,
        writeHeader: true,
        dsvFormatVersion: 'Standard',
        lineEnd: '\n',
        quoteFields: false,
        createEmptyFile: false,
      },
      next: ['Write to Azure Blobs'],
    },
    {
      id: 'Write to Azure Blobs',
      type: 'datasource.write.azure.blob',
      params: {
        accountName: '{{accountName}}',
        accountKey: '{{accountKey}}',
        container: '{{container}}',
      },
    },
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
    {
      id: 'Import Account Error Response',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IEVycm9yIFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgICByZXR1cm4gcmVjb3JkOw0KfQ==',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Error File'],
    },
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
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiBsb2dnZXIuaW5mbygiU2V0IEFjY291bnQgRXJyb3IgUmVzcG9uc2UiLCByZWNvcmQpOw0KICAgIHJldHVybiByZWNvcmQ7DQp9',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Error File'],
    },
    {
      id: 'Set Account Response',
      type: 'record.evaluate',
      params: {
        script: 'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiBsb2dnZXIuaW5mbygiU2V0IEFjY291bnQgUmVzcG9uc2UiLCByZWNvcmQpOw0KICAgIHJldHVybiByZWNvcmQ7DQp9',
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
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgaWYgKHJlY29yZD8ubG9naW5JZHM/LmVtYWlscyAhPT0gdW5kZWZpbmVkKSB7DQogICAgcmVjb3JkLmxvZ2luSWRzLmVtYWlscyA9IHJlY29yZC5sb2dpbklkcy5lbWFpbHMudHJpbSgpICE9PSAnJw0KICAgICAgPyByZWNvcmQubG9naW5JZHMuZW1haWxzLnNwbGl0KCcsJykubWFwKGVtYWlsID0+IGVtYWlsLnRyaW0oKSkNCiAgICAgIDogW107DQogIH0NCg0KICAvLyBIYW5kbGUgInVudmVyaWZpZWRFbWFpbHMiIGZpZWxkOiBDb252ZXJ0IHRvIGFycmF5IG9yIHNldCBhcyBlbXB0eSBhcnJheSBpZiBpdCdzIGFuIGVtcHR5IHN0cmluZw0KICBpZiAocmVjb3JkPy5sb2dpbklkcz8udW52ZXJpZmllZEVtYWlscyAhPT0gdW5kZWZpbmVkKSB7DQogICAgcmVjb3JkLmxvZ2luSWRzLnVudmVyaWZpZWRFbWFpbHMgPSByZWNvcmQubG9naW5JZHMudW52ZXJpZmllZEVtYWlscy50cmltKCkgIT09ICcnDQogICAgICA/IHJlY29yZC5sb2dpbklkcy51bnZlcmlmaWVkRW1haWxzLnNwbGl0KCcsJykubWFwKGVtYWlsID0+IGVtYWlsLnRyaW0oKSkNCiAgICAgIDogW107DQogIH0NCg0KICAvLyBIYW5kbGUgInVzZXJuYW1lIiBmaWVsZDogU2V0IHRvIG51bGwgaWYgaXQncyBhbiBlbXB0eSBzdHJpbmcNCiAgaWYgKHJlY29yZD8ubG9naW5JZHM/LnVzZXJuYW1lID09PSAnJykgew0KICAgIHJlY29yZC5sb2dpbklkcy51c2VybmFtZSA9IG51bGw7DQogIH0NCg0KICBsb2dnZXIuaW5mbygibG9naW5JZHMiLCByZWNvcmQubG9naW5JZHMpOw0KICByZXR1cm4gcmVjb3JkOw0KfQ==',
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
  ],
  version: 1,
}
