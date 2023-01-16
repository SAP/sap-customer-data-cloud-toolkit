const siteDomain = 'a_b_c_site_deployer'
const dropdownOption = 'Test Structure'
const consoleUrl = 'http://console.gigya.com'
const siteDomainName = 'e2e_testing'
const siteSelectorOption = 'Site Selector'
const smsTemplatesOption = 'SMS Templates'
const parentSiteDomain = 'Manually add parent site'
const parentSiteDescription = 'Manually added description'
const expectedErrorMessage = 'Missing required parameter (Manually add parent site - eu1)Missing required parameter : partnerID'
const expectedSuccessMessage = 'OkAll sites have been created successfully'
const childrenSiteDomain = 'Children site domain'
const childrenSiteDescription = 'Children site description'
const missingCredentialsErrorMessage = 'OkPlease insert User and Secret Keys in the Credentials menu'
const emailTemplatesExportErrorHeaderMessage = 'Error - email templates were not exported'
const emailTemplatesExportErrorMessage = 'Error getting email templates'
const emailTemplatesExportErrorMessageDetail =
  'Error getting email templatesThere was an error when getting the email templates or you do not have the required permissions to call it.'
const emailTemplatesIconName = 'Email Templates'
const siteDeployerIconName = 'Site Deployer'
const emailExampleFile = 'cdc-toolbox-email-templates.zip'
const smsExampleFile = 'cdc-toolbox-sms-templates.zip'
const importEmailsFileHeaderText = 'Import email templates'
const importSmsFileHeaderText = 'Import SMS templates'
const importEmailTemplatesErrorMessage = `Error importing email templatesError on template file cdc-toolbox-email-templates/DoubleOptInConfirmation/ar.html. Expected closing tag 'div' (opened in line 8, col 1) instead of closing tag 'body'. on line 18`
const smsTemplatesIconName = 'SMS Templates'
const smsTemplatesExportErrorMessage = 'Error getting SMS templates'
const smsTemplatesExportErrorMessageDetail = 'Error getting SMS templatesThere was an error when getting the SMS templates or you do not have the required permissions to call it.'
const unauthorizedUser = 'Unauthorized userThe supplied userkey was not found'
const cypressDownloadsPath = '../cdc-tools-chrome-extension/cypress/downloads/'
const smsTemplatesExportErrorHeaderMessage = 'Error - SMS templates were not exported'
const smsTemplatesImportErrorHeaderMessage = 'Error - SMS templates were not imported'

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
  importEmailsFileHeaderText,
  importSmsFileHeaderText,
  importEmailTemplatesErrorMessage,
  smsTemplatesIconName,
  smsTemplatesExportErrorMessage,
  smsTemplatesExportErrorMessageDetail,
  emailExampleFile,
  smsExampleFile,
  unauthorizedUser,
  cypressDownloadsPath,
  emailTemplatesExportErrorHeaderMessage,
  smsTemplatesExportErrorHeaderMessage,
  smsTemplatesImportErrorHeaderMessage,
  consoleUrl,
  siteDomainName,
  siteSelectorOption,
  smsTemplatesOption,
}
