export const azureLiteAccountTemplate = `
{
 "name": "{{dataflowName}}",
 "status": "published",
 "description": "Import Lite Account - Toolkit",

 "steps": [
  {
   "id": "3. Transform to CDC Structure",
   "type": "record.evaluate",
   "params": {
    "script": "ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogICAgLy8gY29udmVydHMgaW5wdXQ6ICJwcm9maWxlLmZpcnN0TmFtZSI6IlRlc3QgMSIsInByb2ZpbGUubGFzdE5hbWUiOiJFQiIsInByb2ZpbGUuZWR1Y2F0aW9uLjAuZGVncmVlIjoiR3JhZHVhdGlvbiIsInByb2ZpbGUuZWR1Y2F0aW9uLjAuZmllbGRPZlN0dWR5IjoiU2NpZW5jZSINCiAgICAvLyB0byBvdXRwdXQ6IHsicHJvZmlsZSI6eyJlbWFpbCI6InRlc3Q4ODJAbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJUZXN0IDEiLCJsYXN0TmFtZSI6IkVCIiwiZWR1Y2F0aW9uIjpbeyJkZWdyZWUiOiJHcmFkdWF0aW9uIiwiZmllbGRPZlN0dWR5IjoiU2NpZW5jZSJ9XX0NCiAgICANCiAgICBsb2dnZXIuaW5mbygiSW5wdXQgUGF5bG9hZCIsIHJlY29yZCk7DQoNCiAgICBsZXQgcmVzdWx0ID0ge307DQoNCiAgICBmb3IgKGxldCBrZXkgaW4gcmVjb3JkKSB7DQogICAgICAgIGlmIChyZWNvcmQuaGFzT3duUHJvcGVydHkoa2V5KSkgew0KICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByZWNvcmRba2V5XTsNCiAgICAgICAgICAgIGNvbnN0IGtleXNBcnJheSA9IGtleS5zcGxpdCgnLicpOw0KDQogICAgICAgICAgICBjb25zdCBuZXN0ZWRPYmplY3QgPSBidWlsZE5lc3RlZE9iamVjdChrZXlzQXJyYXksIHZhbHVlKTsNCiAgICAgICAgICAgIHJlc3VsdCA9IG1lcmdlRGVlcChyZXN1bHQsIG5lc3RlZE9iamVjdCk7DQogICAgICAgIH0NCiAgICB9DQoNCiAgICBsb2dnZXIuaW5mbygiVHJhbnNmb3JtZWQgUGF5bG9hZCIsIHJlc3VsdCk7DQogICAgcmV0dXJuIHJlc3VsdDsNCn0NCg0KZnVuY3Rpb24gYnVpbGROZXN0ZWRPYmplY3Qoa2V5cywgdmFsdWUpIHsNCiAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb24gdG8gYnVpbGQgYSBuZXN0ZWQgb2JqZWN0IG9yIGFycmF5DQogICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7DQogICAgICAgIHJldHVybiB7DQogICAgICAgICAgICBba2V5c1swXV06IHZhbHVlDQogICAgICAgIH07DQogICAgfQ0KDQogICAgY29uc3Qga2V5ID0ga2V5c1swXTsNCiAgICBjb25zdCBuZXh0S2V5ID0ga2V5c1sxXTsNCg0KICAgIC8vIElmIG5leHQga2V5IGlzIGEgbnVtYmVyLCB0cmVhdCBpdCBhcyBhbiBhcnJheQ0KICAgIGlmICghaXNOYU4ocGFyc2VJbnQobmV4dEtleSkpKSB7DQogICAgICAgIGxldCBhcnIgPSBbXTsNCiAgICAgICAgYXJyW3BhcnNlSW50KG5leHRLZXkpXSA9IGJ1aWxkTmVzdGVkT2JqZWN0KGtleXMuc2xpY2UoMiksIHZhbHVlKTsNCiAgICAgICAgcmV0dXJuIHsNCiAgICAgICAgICAgIFtrZXldOiBhcnINCiAgICAgICAgfTsNCiAgICB9DQoNCiAgICByZXR1cm4gew0KICAgICAgICBba2V5XTogYnVpbGROZXN0ZWRPYmplY3Qoa2V5cy5zbGljZSgxKSwgdmFsdWUpDQogICAgfTsNCn0NCg0KZnVuY3Rpb24gbWVyZ2VEZWVwKHRhcmdldCwgc291cmNlKSB7DQogICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIG1lcmdlIG5lc3RlZCBvYmplY3RzIG9yIGFycmF5cw0KICAgIGZvciAobGV0IGtleSBpbiBzb3VyY2UpIHsNCiAgICAgICAgaWYgKHNvdXJjZVtrZXldIGluc3RhbmNlb2YgT2JqZWN0ICYmIGtleSBpbiB0YXJnZXQpIHsNCiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldFtrZXldKSAmJiBBcnJheS5pc0FycmF5KHNvdXJjZVtrZXldKSkgew0KICAgICAgICAgICAgICAgIC8vIE1lcmdlIGFycmF5cyBieSBpbmRleCwgbWFraW5nIHN1cmUgdG8gYXZvaWQgbnVsbCB2YWx1ZXMNCiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHRhcmdldFtrZXldLm1hcCgoaXRlbSwgaW5kZXgpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZCA/IG1lcmdlRGVlcChpdGVtLCBzb3VyY2Vba2V5XVtpbmRleF0pIDogc291cmNlW2tleV1baW5kZXhdOw0KICAgICAgICAgICAgICAgIH0pLmNvbmNhdChzb3VyY2Vba2V5XS5zbGljZSh0YXJnZXRba2V5XS5sZW5ndGgpKTsNCiAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzb3VyY2Vba2V5XSwgbWVyZ2VEZWVwKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSkpOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsNCiAgICAgICAgfQ0KICAgIH0NCiAgICByZXR1cm4gdGFyZ2V0Ow0KfQ==",
    "ECMAScriptVersion": "12",
    "notifyLastRecord": false
   },
   "next": [
    "4. Transform Subscriptions"
   ]
  },
  {
   "id": "1. Read azure.blob",
   "type": "datasource.read.azure.blob",
   "params": {
    "accountName": "{{accountName}}",
    "accountKey": "{{accountKey}}",
    "container": "{{container}}",
    "fileNameRegex": "{{readFileNameRegex}}",
    "blobPrefix": "{{blobPrefix}}"
   },
   "next": [
    "2. file.parse.dsv"
   ]
  },
  {
   "id": "2. file.parse.dsv",
   "type": "file.parse.dsv",
   "params": {
    "columnSeparator": ",",
    "fileCharset": "UTF-8",
    "inferTypes": false,
    "addFilename": false
   },
   "next": [
    "3. Transform to CDC Structure"
   ]
  },
  {
   "id": "4. Transform Subscriptions",
   "type": "record.evaluate",
   "params": {
    "script": "ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQogICAgLy8gQ29udmVydHMgaW5wdXQ6ICJzdWJzY3JpcHRpb25zLm5ld3NsZXR0ZXIuY29tbWVyY2lhbC5pc1N1YnNjcmliZWQiOiJUUlVFIg0KICAgIC8vIHRvIG91dHB1dDogeyJzdWJzY3JpcHRpb25zIjogeyJuZXdzbGV0dGVyIjp7ImNvbW1lcmNpYWwiOnsiZW1haWwiOnsiaXNTdWJzY3JpYmVkIjoiVFJVRSJ9fX19fQ0KICAgIC8vIHZhciB4ID0gY3R4LmdldFNoYXJlZFZhcmlhYmxlKCJpbnQiKTsNCiAgICBpZiAocmVjb3JkLmhhc093blByb3BlcnR5KCJzdWJzY3JpcHRpb25zIikpIHsNCiAgICAgICAgcmVjb3JkLnN1YnNjcmlwdGlvbnMgPSBhZGRFbWFpbEJlZm9yZUlzU3Vic2NyaWJlZChyZWNvcmQuc3Vic2NyaXB0aW9ucyk7DQogICAgICAgIGxvZ2dlci5pbmZvKCJUcmFuc2Zvcm1lZCBTdWJzY3JpcHRpb25zIiwgcmVjb3JkLnN1YnNjcmlwdGlvbnMpOw0KICAgIH0NCg0KICAgIHJldHVybiByZWNvcmQ7DQp9DQoNCmZ1bmN0aW9uIGFkZEVtYWlsQmVmb3JlSXNTdWJzY3JpYmVkKG9iaikgew0KICAgIC8vIFJlY3Vyc2l2ZSBmdW5jdGlvbiB0byB0cmF2ZXJzZSBhbmQgZmluZCB0aGUgb2JqZWN0IHdpdGggImlzU3Vic2NyaWJlZCINCiAgICBmdW5jdGlvbiB0cmF2ZXJzZShub2RlKSB7DQogICAgICAgIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcgfHwgbm9kZSA9PT0gbnVsbCkgcmV0dXJuOw0KDQogICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhub2RlKTsNCg0KICAgICAgICAvLyBDaGVjayBpZiB0aGUgY3VycmVudCBub2RlIGhhcyAiaXNTdWJzY3JpYmVkIiBrZXkNCiAgICAgICAgaWYgKGtleXMuaW5jbHVkZXMoImlzU3Vic2NyaWJlZCIpKSB7DQogICAgICAgICAgICBjb25zdCBjb3B5ID0gew0KICAgICAgICAgICAgICAgIC4uLm5vZGUNCiAgICAgICAgICAgIH07DQoNCiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBjdXJyZW50IG9iamVjdCBhbmQgd3JhcCBpdCB3aXRoICJlbWFpbCINCiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHsNCiAgICAgICAgICAgICAgICBkZWxldGUgbm9kZVtrZXldOw0KICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICBub2RlLmVtYWlsID0gY29weTsNCiAgICAgICAgICAgIHJldHVybjsNCiAgICAgICAgfQ0KDQogICAgICAgIC8vIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIHRoZSBjaGlsZCBub2Rlcw0KICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7DQogICAgICAgICAgICBpZiAodHlwZW9mIG5vZGVba2V5XSA9PT0gJ29iamVjdCcgJiYgbm9kZVtrZXldICE9PSBudWxsKSB7DQogICAgICAgICAgICAgICAgdHJhdmVyc2Uobm9kZVtrZXldKTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgfQ0KICAgIH0NCg0KICAgIC8vIFN0YXJ0IHRyYXZlcnNhbCBmcm9tIHRoZSByb290IG9iamVjdA0KICAgIHRyYXZlcnNlKG9iaik7DQoNCiAgICByZXR1cm4gb2JqOw0KfQ==",
    "ECMAScriptVersion": "12",
    "notifyLastRecord": false
   },
   "next": [
    "5. Build Payload"
   ]
  },
  {
   "id": "7.2 Error File",
   "type": "file.format.dsv",
   "params": {
    "fileName": "Error_importLiteAccount_\${now}.csv",
    "columnSeparator": ",",
    "escapeCharacter": "\\\\",
    "maxFileSize": 2,
    "writeHeader": true,
    "dsvFormatVersion": "Standard",
    "lineEnd": "\\n",
    "quoteFields": false,
    "createEmptyFile": false
   },
   "next": [
    "10. Write to Azure Blobs"
   ]
  },
  {
   "id": "10. Write to Azure Blobs",
   "type": "datasource.write.azure.blob",
   "params": {
    "accountName": "{{accountName}}",
    "accountKey": "{{accountKey}}",
    "container": "{{container}}"
   }
  },
  {
   "id": "7. gigya.generic - ImportLiteAccount",
   "type": "datasource.write.gigya.generic",
   "params": {
    "apiMethod": "accounts.importLiteAccount",
    "maxConnections": 10,
    "addResponse": true,
    "apiParams": [
     {
      "sourceField": "email",
      "paramName": "email",
      "value": ""
     },
     {
      "sourceField": "request.context",
      "paramName": "context",
      "value": ""
     },
     {
      "sourceField": "request.profile",
      "paramName": "profile",
      "value": ""
     },
     {
      "sourceField": "request.data",
      "paramName": "data",
      "value": ""
     },
     {
      "sourceField": "request.subscriptions",
      "paramName": "subscriptions",
      "value": ""
     },
     {
      "sourceField": "request.preferences",
      "paramName": "preferences",
      "value": ""
     }
    ]
   },
   "next": [
    "8. Import Account Success Response"
   ],
   "error": [
    "7.1 Import Account Error Response"
   ]
  },
  {
   "id": "8. Import Account Success Response",
   "type": "record.evaluate",
   "params": {
    "script": "ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgcmV0dXJuIHJlY29yZDsNCn0=",
    "ECMAScriptVersion": "12",
    "notifyLastRecord": false
   },
   "next": [
    "9. Success File"
   ]
  },
  {
   "id": "7.1 Import Account Error Response",
   "type": "record.evaluate",
   "params": {
    "script": "ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IEVycm9yIFJlc3BvbnNlIiwgcmVjb3JkKTsNCiAgcmV0dXJuIHJlY29yZDsNCn0=",
    "ECMAScriptVersion": "12",
    "notifyLastRecord": false
   },
   "next": [
    "7.2 Error File"
   ]
  },
  {
   "id": "6. Import Account Request Logger",
   "type": "record.evaluate",
   "params": {
    "script": "ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQoNCiAgbG9nZ2VyLmluZm8oIkltcG9ydCBBY2NvdW50IFJlcXVlc3QiLCByZWNvcmQpOw0KICAgIHJldHVybiByZWNvcmQ7DQp9",
    "ECMAScriptVersion": "12",
    "notifyLastRecord": false
   },
   "next": [
    "7. gigya.generic - ImportLiteAccount"
   ]
  },
  {
   "id": "9. Success File",
   "type": "file.format.dsv",
   "params": {
    "fileName": "Success_importLiteAccount_\${now}.csv",
    "columnSeparator": ",",
    "escapeCharacter": "\\\\",
    "maxFileSize": 2,
    "writeHeader": true,
    "dsvFormatVersion": "Standard",
    "lineEnd": "\\n",
    "quoteFields": false,
    "createEmptyFile": false
   },
   "next": [
    "10. Write to Azure Blobs"
   ]
  },
  {
   "id": "5. Build Payload",
   "type": "record.evaluate",
   "params": {
    "script": "ZnVuY3Rpb24gcHJvY2VzcyhyZWNvcmQsIGN0eCwgbG9nZ2VyLCBuZXh0KSB7DQovLyByZWNvcmQuZW1haWwgPSByZWNvcmQucHJvZmlsZS5lbWFpbDsNCiAgICBjb25zdCByZXF1ZXN0ID0gew0KICAgICAgICBwcm9maWxlOiB7fSwNCiAgICAgICAgZGF0YToge30sDQogICAgICAgIHN1YnNjcmlwdGlvbnM6IHt9LA0KICAgICAgICBwcmVmZXJlbmNlczoge30sDQogICAgICAgIGNvbnRleHQ6IG51bGwNCiAgICB9Ow0KDQogICAgLy8gQXNzaWduIHZhbHVlcyBmcm9tIGByZWNvcmRgIHRvIGByZXF1ZXN0YCBpZiBwcmVzZW50IGFuZCB2YWxpZA0KICAgIGFzc2lnbklmUHJlc2VudChyZXF1ZXN0LCAncHJvZmlsZScsIHJlY29yZCk7DQogICAgYXNzaWduSWZQcmVzZW50KHJlcXVlc3QsICdkYXRhJywgcmVjb3JkKTsNCiAgICBhc3NpZ25JZlByZXNlbnQocmVxdWVzdCwgJ3N1YnNjcmlwdGlvbnMnLCByZWNvcmQpOw0KICAgIGFzc2lnbklmUHJlc2VudChyZXF1ZXN0LCAncHJlZmVyZW5jZXMnLCByZWNvcmQpOw0KICAgIGFzc2lnbklmUHJlc2VudChyZXF1ZXN0LCAnY29udGV4dCcsIHJlY29yZCk7DQoNCiAgICByZWNvcmQucmVxdWVzdCA9IHJlcXVlc3Q7DQoNCiAgICBsb2dnZXIuaW5mbygiVHJhbnNmb3JtZWQgUmVxdWVzdCBQYXlsb2FkIiwgcmVjb3JkKTsNCiAgICByZXR1cm4gcmVjb3JkOw0KfQ0KDQovLyBIZWxwZXIgZnVuY3Rpb24gdG8gYXNzaWduIHZhbHVlIGlmIGl0IGV4aXN0cywgaXMgbm90IG51bGwsIGFuZCBpcyBub3QgYW4gZW1wdHkgc3RyaW5nDQpmdW5jdGlvbiBhc3NpZ25JZlByZXNlbnQodGFyZ2V0LCBrZXksIHNvdXJjZSkgew0KICAgIGlmIChzb3VyY2UgJiYgc291cmNlW2tleV0gIT09IHVuZGVmaW5lZCAmJiBzb3VyY2Vba2V5XSAhPT0gbnVsbCAmJiBzb3VyY2Vba2V5XSAhPT0gJycpIHsNCiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsNCiAgICB9DQp9",
    "ECMAScriptVersion": "12",
    "notifyLastRecord": false
   },
   "next": [
    "6. Import Account Request Logger"
   ]
  }
 ],
 "version": 1
}
`
