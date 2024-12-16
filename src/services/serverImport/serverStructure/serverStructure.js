export const serverStructure = {
  azure: [
    { id: '{{dataflowName}}', name: 'Dataflow Name *', type: 'text', placeholder: 'Enter your Dataflow Name', tooltip: 'The name of the dataflow.' },
    { id: '{{accountName}}', name: 'Account Name *', type: 'text', placeholder: 'Enter your Account Name', tooltip: 'The Azure account name.' },
    { id: '{{accountKey}}', name: 'Account Key *', type: 'text', placeholder: 'Enter your Account Key', tooltip: 'The Azure account key.' },
    { id: '{{container}}', name: 'Container *', type: 'text', placeholder: 'Enter your Container', tooltip: 'The blob container name.' },
    { id: '{{readFileNameRegex}}', name: 'File Name Regex', type: 'text', placeholder: 'Enter your File Name Regex', tooltip: 'A regular expression to apply for file filtering.' },
    { id: '{{blobPrefix}}', name: 'Blob Prefix', type: 'text', placeholder: 'Enter your Blob Prefix', tooltip: 'The prefix to filter blobs upon download.' },
  ],
  amazon: [
    { id: '{{dataflowName}}', name: 'Dataflow Name *', type: 'text', placeholder: 'Enter your Dataflow Name', tooltip: 'The name of the dataflow' },
    { id: '{{bucketName}}', name: 'Bucket Name *', type: 'text', placeholder: 'Enter your Bucket Name', tooltip: 'A bucket is owned by the AWS account that created it.' },
    {
      id: '{{accessKey}}',
      name: 'Access Key *',
      type: 'text',
      placeholder: 'Enter your Access Key',
      tooltip: 'This is actually a username. It identifies the user who owns the account. No two accounts can have the same AWS Access Key.',
    },
    { id: '{{secretKey}}', name: 'Secret Key *', type: 'text', placeholder: 'Enter your Secret Key', tooltip: 'This key plays the role of a password.' },
    {
      id: '{{objectKeyPrefix}}',
      name: 'Object Key Prefix *',
      type: 'text',
      placeholder: 'Enter your Object Key Prefix',
      tooltip: 'A prefix to assign to objects (object key = <prefix><file name>).',
    },
  ],
  sftp: [{ name: 'field5', type: 'date', placeholder: 'Select date for Option 3' }],
}
