# SAP Customer Data Cloud Toolkit

## About this project
The Browser Extension created to extend the existing functionality of the SAP Customer Data Cloud Console(https://console.gigya.com).

#### Features:

- Site Deployer
- Import/Export email templates
- Import/Export SMS templates
- Copy Configuration extended
- Site Deployer with Copy Configuration Extended

## Requirements and Setup

### Supported browsers

1. Google Chrome

### Run in SAP Customer Data Cloud Console

1. `git clone https://github.com/SAP/sap-customer-data-cloud-toolkit.git`
2. `npm install`
3. `npm run build`
4. Navigate to [chrome://extensions/](chrome://extensions/)
5. Click the "Developer mode" toggle switch in the top right of the window
6. Click the "Load unpacked" button in top left of the window
7. Go to the `cdc-tools-chrome-extension` directory and select the `build` directory to load the extension
8. Navigate to https://console.gigya.com/ to see the UI changes

### Run in Development Environment

1. `git clone https://github.com/SAP/sap-customer-data-cloud-toolkit.git`
2. `npm install`
3. `Create the environment variables REACT_APP_USERKEY and REACT_APP_SECRET with your user key and secret values, 
   to avoid to set them multiple times during the application execution`
4. `npm run start`

### Cypress UI tests

1. Run `npm run cypress:ci`

### Cypress End to End tests
1. Check the project's documentation on https://github.com/SAP/sap-customer-data-cloud-toolkit/wiki

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/sap-customer-data-cloud-toolkit/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2023 SAP SE or an SAP affiliate company and SAP Customer Data Cloud Toolkit contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/sap-customer-data-cloud-toolkit.git).
