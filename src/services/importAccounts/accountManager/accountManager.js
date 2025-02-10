class AccountManager {
  dataflow = ''
  storageProvider

  constructor(storageProvider) {
    this.storageProvider = storageProvider
  }
  getDataflow() {
    return this.dataflow
  }

  replaceVariables(id, variables) {
    this.dataflow.id = id
    let dataflowString = JSON.stringify(this.dataflow)
    for (const variable of variables) {
      const regex = new RegExp(variable.id, 'g')
      if (variable.value) {
        const escapedValue = variable.value.replace(/\\/g, '\\\\')
        dataflowString = dataflowString.replaceAll(regex, escapedValue)
      } else {
        dataflowString = dataflowString.replaceAll(regex, '')
      }
    }
    return JSON.parse(dataflowString)
  }

  static writeFile = [
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
  ]

  static errorFile = (nextStep, accountType) => [
    {
      id: 'Error File',
      type: 'file.format.dsv',
      params: {
        fileName: `Error_${accountType}Account_Upload_\${now}.csv`,
        columnSeparator: ',',
        escapeCharacter: '\\',
        maxFileSize: 2,
        writeHeader: true,
        dsvFormatVersion: 'Standard',
        lineEnd: '\n',
        quoteFields: false,
        createEmptyFile: false,
      },
      next: [nextStep],
    },
  ]

  static commonErrorResponse = [
    {
      id: 'Import Account Error Response',
      type: 'record.evaluate',
      params: {
        script:
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IEVycm9yIFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgcmV0dXJuIHJlY29yZDsNCn0=',
        ECMAScriptVersion: '12',
        notifyLastRecord: false,
      },
      next: ['Error File'],
    },
  ]

  static commonTransformCDCStructure(step) {
    return [
      {
        id: 'Transform to CDC Structure',
        type: 'record.evaluate',
        params: {
          script:
            'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgICBsb2dnZXIuaW5mbygiSW5wdXQgUGF5bG9hZCIsIHJlY29yZCk7DQoNCiAgICBsZXQgcmVzdWx0ID0ge307DQoNCiAgICBmb3IgKGxldCBrZXkgaW4gcmVjb3JkKSB7DQogICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkoa2V5KSkgew0KICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByZWNvcmRba2V5XTsNCiAgICAgICAgICAgIGNvbnN0IGtleXNBcnJheSA9IGtleS5zcGxpdCgnLicpOw0KDQogICAgICAgICAgICBjb25zdCBuZXN0ZWRPYmplY3QgPSBidWlsZE5lc3RlZE9iamVjdChrZXlzQXJyYXksIHZhbHVlKTsNCiAgICAgICAgICAgIHJlc3VsdCA9IG1lcmdlRGVlcChyZXN1bHQsIG5lc3RlZE9iamVjdCk7DQogICAgICAgIH0NCiAgICB9DQoNCiAgICBsb2dnZXIuaW5mbygiVHJhbnNmb3JtZWQgUGF5bG9hZCIsIHJlc3VsdCk7DQogICAgcmV0dXJuIHJlc3VsdDsNCn0NCg0KZnVuY3Rpb24gYnVpbGROZXN0ZWRPYmplY3Qoa2V5cywgdmFsdWUpIHsNCiAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb24gdG8gYnVpbGQgYSBuZXN0ZWQgb2JqZWN0IG9yIGFycmF5DQogICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7DQogICAgICAgIHJldHVybiB7DQogICAgICAgICAgICBba2V5c1swXV06IHZhbHVlDQogICAgICAgIH07DQogICAgfQ0KDQogICAgY29uc3Qga2V5ID0ga2V5c1swXTsNCiAgICBjb25zdCBuZXh0S2V5ID0ga2V5c1sxXTsNCg0KICAgIC8vIElmIG5leHQga2V5IGlzIGEgbnVtYmVyLCB0cmVhdCBpdCBhcyBhbiBhcnJheQ0KICAgIGlmICghaXNOYU4ocGFyc2VJbnQobmV4dEtleSkpKSB7DQogICAgICAgIGxldCBhcnIgPSBbXTsNCiAgICAgICAgYXJyW3BhcnNlSW50KG5leHRLZXkpXSA9IGJ1aWxkTmVzdGVkT2JqZWN0KGtleXMuc2xpY2UoMiksIHZhbHVlKTsNCiAgICAgICAgcmV0dXJuIHsNCiAgICAgICAgICAgIFtrZXldOiBhcnINCiAgICAgICAgfTsNCiAgICB9DQoNCiAgICByZXR1cm4gew0KICAgICAgICBba2V5XTogYnVpbGROZXN0ZWRPYmplY3Qoa2V5cy5zbGljZSgxKSwgdmFsdWUpDQogICAgfTsNCn0NCg0KZnVuY3Rpb24gbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7DQogICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIG1lcmdlIG5lc3RlZCBvYmplY3RzIG9yIGFycmF5cw0KICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHsNCiAgICAgICAgaWYgKHNvdXJjZVtrZXldIGluc3RhbmNlb2YgT2JqZWN0ICYmIGtleSBpbiB0YXJnZXQpIHsNCiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldFtrZXldKSAmJiBBcnJheS5pc0FycmF5KHNvdXJjZVtrZXldKSkgew0KICAgICAgICAgICAgICAgIC8vIE1lcmdlIGFycmF5cyBieSBpbmRleCwgbWFraW5nIHN1cmUgdG8gYXZvaWQgbnVsbCB2YWx1ZXMNCiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHRhcmdldFtrZXldLm1hcCgoaXRlbSwgaW5kZXgpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZCA/IG1lcmdlRGVlcChpdGVtLCBzb3VyY2Vba2V5XVtpbmRleF0pIDogc291cmNlW2tleV1baW5kZXhdOw0KICAgICAgICAgICAgICAgIH0pLmNvbmNhdChzb3VyY2Vba2V5XS5zbGljZSh0YXJnZXRba2V5XS5sZW5ndGgpKTsNCiAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzb3VyY2Vba2V5XSwgbWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSkpOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsNCiAgICAgICAgfQ0KICAgIH0NCiAgICByZXR1cm4gdGFyZ2V0Ow0KfQ==',
          ECMAScriptVersion: '12',
          notifyLastRecord: false,
        },
        next: [step],
      },
    ]
  }

  static commonImportAccountRequestLogger(step) {
    return [
      {
        id: 'Import Account Request Logger',
        type: 'record.evaluate',
        params: {
          script:
            'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IFJlcXVlc3QiLCByZWNvcmQpOw0KICAgIHJldHVybiByZWNvcmQ7DQp9',
          ECMAScriptVersion: '12',
          notifyLastRecord: false,
        },
        next: [step],
      },
    ]
  }

  static commonImportAccountSuccessResponse(script, step) {
    return [
      {
        id: 'Import Account Success Response',
        type: 'record.evaluate',
        params: {
          script: script,
          ECMAScriptVersion: '12',
          notifyLastRecord: false,
        },
        next: [step],
      },
    ]
  }

  static createGigyaGenericStep(id, apiMethod, apiParams, nextStep, errorStep) {
    return {
      id,
      type: 'datasource.write.gigya.generic',
      params: {
        apiMethod,
        maxConnections: 10,
        addResponse: true,
        apiParams,
      },
      next: [nextStep],
      error: [errorStep],
    }
  }

  static dinamicStep(id, script, step) {
    return [
      {
        id: id,
        type: 'record.evaluate',
        params: {
          script: script,
          ECMAScriptVersion: '12',
          notifyLastRecord: false,
        },
        next: [step],
      },
    ]
  }

  static successFile = (nextStep, accountType) => [
    {
      id: 'Success File',
      type: 'file.format.dsv',
      params: {
        fileName: `Error_${accountType}Account_Upload_\${now}.csv`,
        columnSeparator: ',',
        escapeCharacter: '\\',
        maxFileSize: 2,
        writeHeader: true,
        dsvFormatVersion: 'Standard',
        lineEnd: '\n',
        quoteFields: false,
        createEmptyFile: false,
      },
      next: [nextStep],
    },
  ]
}

export default AccountManager
