import AccountManager from './accountManager'
import { AccountType } from './accountType'

class LiteAccount extends AccountManager {
  constructor(storageProvider) {
    super(storageProvider)
    this.dataflow = this.#createDataflow(storageProvider)
  }

  #createDataflow(storageProvider) {
    const readFile = 'file.parse.dsv'
    const dataflow = this.#genericLiteAccountDataflow(storageProvider.getWriter().id)
    dataflow.steps.splice(1, 0, this.storageProvider.getReader(readFile))
    dataflow.steps.splice(4, 0, this.storageProvider.getWriter())
    return dataflow
  }

  #genericLiteAccountDataflow(successNextStep) {
    return {
      name: '{{dataflowName}}',
      status: 'published',
      description: 'Import Lite Account - Toolkit',
      steps: [
        ...AccountManager.commonTransformCDCStructure('Transform Subscriptions'),
        ...AccountManager.writeFile,
        ...AccountManager.dinamicStep(
          'Transform Subscriptions',
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogICAgLy8gdmFyIHggPSBjdHguZ2V0U2hhcmVkVmFyaWFibGUoImludCIpOw0KICBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KCJzdWJzY3JpcHRpb25zIikpIHsNCiAgICByZWNvcmQuc3Vic2NyaXB0aW9ucyA9IGFkZEVtYWlsQmVmb3JlSXNTdWJzY3JpYmVkKHJlY29yZC5zdWJzY3JpcHRpb25zKTsNCiAgICBsb2dnZXIuaW5mbygiVHJhbnNmb3JtZWQgU3Vic2NyaXB0aW9ucyIsIHJlY29yZC5zdWJzY3JpcHRpb25zKTsNCiAgfQ0KDQogIHJldHVybiByZWNvcmQ7DQp9DQoNCmZ1bmN0aW9uIGFkZEVtYWlsQmVmb3JlSXNTdWJzY3JpYmVkKG9iaikgew0KICAvLyBSZWN1cnNpdmUgZnVuY3Rpb24gdG8gdHJhdmVyc2UgYW5kIGZpbmQgdGhlIG9iamVjdCB3aXRoICJpc1N1YnNjcmliZWQiDQogIGZ1bmN0aW9uIHRyYXZlcnNlKG5vZGUpIHsNCiAgICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnIHx8IG5vZGUgPT09IG51bGwpIHJldHVybjsNCg0KICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhub2RlKTsNCg0KICAgIC8vIENoZWNrIGlmIHRoZSBjdXJyZW50IG5vZGUgaGFzICJpc1N1YnNjcmliZWQiIGtleQ0KICAgIGlmIChrZXlzLmluY2x1ZGVzKCJpc1N1YnNjcmliZWQiKSkgew0KICAgICAgY29uc3QgY29weSA9IHsgLi4ubm9kZSB9Ow0KDQogICAgICAvLyBDbGVhciB0aGUgY3VycmVudCBvYmplY3QgYW5kIHdyYXAgaXQgd2l0aCAiZW1haWwiDQogICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7DQogICAgICAgIGRlbGV0ZSBub2RlW2tleV07DQogICAgICB9DQoNCiAgICAgIG5vZGUuZW1haWwgPSBjb3B5Ow0KICAgICAgcmV0dXJuOw0KICAgIH0NCg0KICAgIC8vIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIHRoZSBjaGlsZCBub2Rlcw0KICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHsNCiAgICAgIGlmICh0eXBlb2Ygbm9kZVtrZXldID09PSAnb2JqZWN0JyAmJiBub2RlW2tleV0gIT09IG51bGwpIHsNCiAgICAgICAgdHJhdmVyc2Uobm9kZVtrZXldKTsNCiAgICAgIH0NCiAgICB9DQogIH0NCg0KICAvLyBTdGFydCB0cmF2ZXJzYWwgZnJvbSB0aGUgcm9vdCBvYmplY3QNCiAgdHJhdmVyc2Uob2JqKTsNCg0KICByZXR1cm4gb2JqOw0KfQ0K',
          'Build Payload',
        ),
        ...AccountManager.errorFile(successNextStep, AccountType.Lite),
        AccountManager.createGigyaGenericStep(
          'gigya.generic - ImportLiteAccount',
          'accounts.importLiteAccount',
          [
            { sourceField: 'email', paramName: 'email', value: '' },
            { sourceField: 'request.context', paramName: 'context', value: '' },
            { sourceField: 'request.profile', paramName: 'profile', value: '' },
            { sourceField: 'request.data', paramName: 'data', value: '' },
            { sourceField: 'request.subscriptions', paramName: 'subscriptions', value: '' },
          ],
          'Import Account Success Response',
          'Import Account Error Response',
        ),
        ...AccountManager.commonImportAccountSuccessResponse(
          'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgcmV0dXJuIHJlY29yZDsNCn0=',
          'Success File',
        ),
        ...AccountManager.commonErrorResponse,
        ...AccountManager.commonImportAccountRequestLogger('gigya.generic - ImportLiteAccount'),
        ...AccountManager.successFile(successNextStep, AccountType.Lite),
        {
          id: 'Build Payload',
          type: 'record.evaluate',
          params: {
            script:
              'ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQpyZWNvcmQuZW1haWwgPSByZWNvcmQucHJvZmlsZS5lbWFpbDsNCiAgICBjb25zdCByZXF1ZXN0ID0gew0KICAgICAgICBwcm9maWxlOiB7fSwNCiAgICAgICAgZGF0YToge30sDQogICAgICAgIHN1YnNjcmlwdGlvbnM6IHt9LA0KICAgICAgICBjb250ZXh0OiBudWxsDQogICAgfTsNCg0KICAgIC8vIEFzc2lnbiB2YWx1ZXMgZnJvbSBgcmVjb3JkYCB0byBgcmVxdWVzdGAgaWYgcHJlc2VudCBhbmQgdmFsaWQNCiAgICBhc3NpZ25JZlByZXNlbnQocmVxdWVzdCwgJ3Byb2ZpbGUnLCByZWNvcmQpOw0KICAgIGFzc2lnbklmUHJlc2VudChyZXF1ZXN0LCAnZGF0YScsIHJlY29yZCk7DQogICAgYXNzaWduSWZQcmVzZW50KHJlcXVlc3QsICdzdWJzY3JpcHRpb25zJywgcmVjb3JkKTsNCiAgICBhc3NpZ25JZlByZXNlbnQocmVxdWVzdCwgJ2NvbnRleHQnLCByZWNvcmQpOw0KDQogICAgcmVjb3JkLnJlcXVlc3QgPSByZXF1ZXN0Ow0KDQogICAgbG9nZ2VyLmluZm8oIlRyYW5zZm9ybWVkIFJlcXVlc3QgUGF5bG9hZCIsIHJlY29yZCk7DQogICAgcmV0dXJuIHJlY29yZDsNCn0NCg0KLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGFzc2lnbiB2YWx1ZSBpZiBpdCBleGlzdHMsIGlzIG5vdCBudWxsLCBhbmQgaXMgbm90IGFuIGVtcHR5IHN0cmluZw0KZnVuY3Rpb24gYXNzaWduSWZQcmVzZW50KHRhcmdldCwga2V5LCBzb3VyY2UpIHsNCiAgICBpZiAoc291cmNlICYmIHNvdXJjZVtrZXldICE9PSB1bmRlZmluZWQgJiYgc291cmNlW2tleV0gIT09IG51bGwgJiYgc291cmNlW2tleV0gIT09ICcnKSB7DQogICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07DQogICAgfQ0KfQ==',
            ECMAScriptVersion: '12',
            notifyLastRecord: false,
          },
          next: ['Import Account Request Logger'],
        },
      ],
    }
  }
}

export default LiteAccount
