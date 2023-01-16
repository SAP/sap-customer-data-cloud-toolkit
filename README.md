# CDC Automation Tools - Chrome Extension

App created to extend the existing functionality of the CDC Console.

#### Features:

- Site Deployer
- Copy Configuration 1 to many
  - Extra features: social providers, policies, email templates

## Run in CDC Console

1. `git clone https://github.tools.sap/cx-hub-pt/cdc-tools-chrome-extension.git`
1. `npm install`
1. `npm build`
1. Navigate to [chrome://extensions/](chrome://extensions/)
1. Click the "Developer mode" toggle switch in the top right of the window
1. Click the "Load unpacked" button in top left of the window
1. Go to the `cdc-tools-chrome-extension` directory and select the `build` directory to load the extension
1. Navigate to https://console.gigya.com/ to see the UI changes

## Run in Development Environment

1. `git clone https://github.tools.sap/cx-hub-pt/cdc-tools-chrome-extension.git`
1. `npm install`
1. `npm run start`

## Cypress End-to-End tests

1. Run `npm run cypress:ci`
