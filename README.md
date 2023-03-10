# SAP Customer Data Cloud Automation Tools - Chrome Extension

App created to extend the existing functionality of the SAP Customer Data Cloud Console.

#### Features:

- Site Deployer
- Import/Export email templates
- Import/Export SMS templates

## Run in SAP Customer Data Cloud Console

1. `git clone https://github.tools.sap/cx-servicesautomation/cdc-tools-chrome-extension.git`
2. `npm install`
3. `npm run build`
4. Navigate to [chrome://extensions/](chrome://extensions/)
5. Click the "Developer mode" toggle switch in the top right of the window
6. Click the "Load unpacked" button in top left of the window
7. Go to the `cdc-tools-chrome-extension` directory and select the `build` directory to load the extension
8. Navigate to https://console.gigya.com/ to see the UI changes

## Run in Development Environment

1. `git clone https://github.tools.sap/cx-servicesautomation/cdc-tools-chrome-extension.git`
2. `npm install`
3. `Create the environment variables REACT_APP_USERKEY and REACT_APP_SECRET with your user key and secret values, 
   to avoid to set them multiple times during the application execution`
4. `npm run start`

## Cypress UI tests

1. Run `npm run cypress:ci`

## Cypress End to End tests
1. Check the project's documentation on https://wiki.one.int.sap/wiki/display/CDCTOOLBOX/Documentation+Guide
