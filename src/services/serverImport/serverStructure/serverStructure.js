export const serverStructure = {
  azure: [
    { id: '{{accountName}}', name: 'Account Name', type: 'text', placeholder: 'Enter your Account Name' },
    { id: '{{accountKey}}', name: 'Account Key', type: 'text', placeholder: 'Enter your Account Key' },
    { id: '{{container}}', name: 'Container', type: 'text', placeholder: 'Enter your Container' },
    { id: '{{readFileNameRegex}}', name: 'File Name Regex', type: 'text', placeholder: 'Enter your File Name Regex' },
    { id: '{{blobPrefix}}', name: 'Blob Prefix', type: 'text', placeholder: 'Enter your Blob Prefix' },
  ],
  amazon: [
    { id: '{{bucketName}}', name: 'Bucket Name', type: 'text', placeholder: 'Enter your Bucket Name' },
    { id: '{{accessKey}}', name: 'Access Key', type: 'text', placeholder: 'Enter your Access Key' },
    { id: '{{secretKey}}', name: 'Secret Key', type: 'text', placeholder: 'Enter your Secret Key' },
    { id: '{{objectKeyPrefix}}', name: 'Object Key Prefix', type: 'text', placeholder: 'Enter your Object Key Prefix' },
  ],
  sftp: [{ name: 'field5', type: 'date', placeholder: 'Select date for Option 3' }],
}
