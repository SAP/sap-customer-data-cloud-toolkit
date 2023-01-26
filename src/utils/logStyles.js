// Console.log styles, ex: console.log('SAP Customer Data Cloud Toolbox - %cLoaded', logStyles.green)
const padding = 'padding: 2px 4px'
const borderRadius = 'border-radius: 4px'
export const logStyles = {
  lightGreenBold: ['color: #000', 'background-color: #50e591', padding, borderRadius, 'font-weight: bold'].join(';'),
  green: ['color: #fff', 'background-color: green', padding, borderRadius].join(';'),
  gray: ['color: #fff', 'background-color: #444', padding, borderRadius].join(';'),
}
