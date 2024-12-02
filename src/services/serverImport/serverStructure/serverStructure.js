export const serverStructure = {
  azure: [
    { name: 'Account Name', type: 'text', placeholder: 'Enter your Account Name' },
    { name: 'Account Key', type: 'text', placeholder: 'Enter your Account Key' },
    { name: 'Container', type: 'text', placeholder: 'Enter your Container' },
    { name: 'File Name Regex', type: 'text', placeholder: 'Enter your File Name Regex' },
    { name: 'Blob Prefix', type: 'text', placeholder: 'Enter your Blob Prefix' },
  ],
  amazon: [
    { name: 'Bucket Name', type: 'text', placeholder: 'Enter your Bucket Name' },
    { name: 'Access Key', type: 'text', placeholder: 'Enter your Access Key' },
    { name: 'Secret Key', type: 'text', placeholder: 'Enter your Secret Key' },
    { name: 'Object Key Prefix', type: 'text', placeholder: 'Enter your Object Key Prefix' },
  ],
  sftp: [{ name: 'field5', type: 'date', placeholder: 'Select date for Option 3' }],
}
