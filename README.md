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
3. `Create the environment variables REACT_APP_USERKEY and REACT_APP_SECRET with your user key and secret values, to avoid to set them multiple times during the application execution`
4. `npm run start`

## Cypress UI tests

1. Run `npm run cypress:ci`

## Cypress End to End tests

1. Check the project's documentation on https://wiki.one.int.sap/wiki/display/CDCTOOLBOX/Documentation+Guide

# SAP Repository Template

Default templates for SAP open source repositories, including LICENSE, .reuse/dep5, Code of Conduct, etc... All repositories on github.com/SAP will be created based on this template.

## To-Do

In case you are the maintainer of a new SAP open source project, these are the steps to do with the template files:

- Check if the default license (Apache 2.0) also applies to your project. A license change should only be required in exceptional cases. If this is the case, please change the [license file](LICENSE).
- Enter the correct metadata for the REUSE tool. See our [wiki page](https://wiki.wdf.sap.corp/wiki/display/ospodocs/Using+the+Reuse+Tool+of+FSFE+for+Copyright+and+License+Information) for details how to do it. You can find an initial .reuse/dep5 file to build on. Please replace the parts inside the single angle quotation marks < > by the specific information for your repository and be sure to run the REUSE tool to validate that the metadata is correct.
- Adjust the contribution guidelines (e.g. add coding style guidelines, pull request checklists, different license if needed etc.)
- Add information about your project to this README (name, description, requirements etc). Especially take care for the <your-project> placeholders - those ones need to be replaced with your project name. See the sections below the horizontal line and [our guidelines on our wiki page](https://wiki.wdf.sap.corp/wiki/display/ospodocs/Guidelines+for+README.md+file) what is required and recommended.
- Remove all content in this README above and including the horizontal line ;)

---

# Our new open source project

## About this project

_Insert a short description of your project here..._

## Requirements and Setup

_Insert a short description what is required to get your project running..._

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/<your-project>/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright (20xx-)20xx SAP SE or an SAP affiliate company and <your-project> contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/<your-project>).
