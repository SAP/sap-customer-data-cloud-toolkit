const siteDomain = 'a_b_c_site_deployer'
const dropdownOption = 'Test Structure'

const parentSiteDomain = 'Manually add parent site'
const parentSiteDescription = 'Manually added description'
const expectedErrorMessage = 'Missing required parameter (Manually add parent site - eu1)Missing required parameter : partnerID'
const expectedSuccessMessage = 'OkAll sites have been created successfully'
const childrenSiteDomain = 'Children site domain'
const childrenSiteDescription = 'Children site description'
const missingCredentialsErrorMessage = 'OkPlease insert User and Secret Keys in the Credentials menu'
const emailTemplatesExportErrorMessage = 'Error getting email templates'
const emailTemplatesExportErrorMessageDetail =
  'Error getting email templatesThere was an error when getting the email templates or you do not have the required permissions to call it.'
const emailTemplatesIconName = 'Email Templates'
const siteDeployerIconName = 'Site Deployer'
const cdcExampleFile = 'cdc-toolbox-email-templates.zip'
const importEmailsFileHeaderText = 'Import email templates'
const importSmsFileHeaderText = 'Import SMS templates'
const importMessage = `Error importing email templatesError on template file cdc-toolbox-email-templates/DoubleOptInConfirmation/ar.html. Expected closing tag 'div' (opened in line 8, col 1) instead of closing tag 'body'. on line 18`
const smsTemplatesIconName = 'SMS Templates'
const smsTemplatesExportErrorMessage = 'Error getting SMS templates'
const smsTemplatesExportErrorMessageDetail = 'Error getting SMS templatesThere was an error when getting the SMS templates or you do not have the required permissions to call it.'
// TODO: create separated data for emails and sms and aplly it on e2e_sms_templates_tests.cy.js

export {
  siteDomain,
  dropdownOption,
  parentSiteDomain,
  parentSiteDescription,
  expectedErrorMessage,
  expectedSuccessMessage,
  childrenSiteDomain,
  childrenSiteDescription,
  missingCredentialsErrorMessage,
  emailTemplatesExportErrorMessage,
  emailTemplatesExportErrorMessageDetail,
  emailTemplatesIconName,
  siteDeployerIconName,
  cdcExampleFile,
  importEmailsFileHeaderText,
  importSmsFileHeaderText,
  importMessage,
  smsTemplatesIconName,
  smsTemplatesExportErrorMessage,
  smsTemplatesExportErrorMessageDetail,
}
