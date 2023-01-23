const siteDomain = 'a_b_c_site_deployer'
const dropdownOption = 'Test Structure'
const consoleUrl = 'http://console.gigya.com'
const siteDomainName = 'e2e_testing'
const siteSelectorOption = 'Site Selector'
const smsTemplatesOption = 'SMS Templates'
const parentSiteDomain = 'Manually add parent site'
const parentSiteDescription = 'Manually added description'
const expectedErrorMessage = 'Missing required parameter (Manually add parent site - eu1)Missing required parameter : partnerID'
const expectedSuccessMessage = 'OkAll sites have been created successfully.'
const childrenSiteDomain = 'Children site domain'
const childrenSiteDescription = 'Children site description'
const missingCredentialsErrorMessage = 'OkPlease insert User and Secret Keys in the Credentials menu.'
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
const importEmailTemplatesErrorMessage = `Error validating email templatesError on template file cdc-toolbox-email-templates/DoubleOptInConfirmation/ar.html. Expected closing tag 'div' (opened in line 8, col 1) instead of closing tag 'body'. on line 18`
const smsTemplatesIconName = 'SMS Templates'
const smsTemplatesExportErrorMessage = 'Error getting SMS templates'
const smsTemplatesExportErrorMessageDetail = 'Error getting SMS templatesThere was an error when getting the SMS templates or you do not have the required permissions to call it.'
const unauthorizedUser = 'Unauthorized userThe supplied userkey was not found'
const cypressDownloadsPath = '../cdc-tools-chrome-extension/cypress/downloads/'
const smsTemplatesExportErrorHeaderMessage = 'Error - SMS templates were not exported'
const smsTemplatesImportErrorHeaderMessage = 'Error - SMS templates were not imported'

const errorToManualRemoveSiteMessage = {
  callId: '079f19c68315418dae4179eca5373122',
  errorCode: 400,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2022-11-04T11:59:16.142Z',
  siteID: 131133173102,
  apiKey: '4_Zk14vYv3A_tdMF912nfmEA',
  tempId: '0feb52c1-e330-47b6-a0c3-27a8144fbd1b',
}

const emailTemplateExportError = {
  errorMessage: 'Error getting email templates',
  errorDetails: 'There was an error when getting the email templates or you do not have the required permissions to call it.',
  statusCode: 403,
  errorCode: 403007,
  statusReason: 'Forbidden',
  callId: 'ed5c54bfe321478b8db4298c2539265a',
  apiVersion: 2,
  time: 'Date.now()',
}

const smsTemplateExportError = {
  errorMessage: 'Error getting SMS templates',
  errorDetails: 'There was an error when getting the SMS templates or you do not have the required permissions to call it.',
  statusCode: 403,
  errorCode: 403007,
  statusReason: 'Forbidden',
  callId: 'ed5c54bfe321478b8db4298c2539265a',
  apiVersion: 2,
  time: 'Date.now()',
}

const smsTemplateSuccessResponse = {
  callId: '69867486da1443d7925e935bf1b84cb0',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-01-20T17:50:26.126Z',
}

const siteConfigResponse = {
  callId: '0e2233dce5fd4b439f5645dd842ff44a',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-01-20T17:50:26.196Z',
  baseDomain: 'daniel',
  dataCenter: 'eu1',
  trustedSiteURLs: ['*.daniel/*', 'daniel/*'],
  tags: [],
  description: 'Local Environment',
  captchaProvider: 'Google',
  settings: {
    CNAME: '',
    shortURLDomain: '',
    shortURLRedirMethod: 'JS',
    encryptPII: true,
  },
  siteGroupConfig: {
    enableSSO: false,
  },
  urlShorteners: {
    bitly: {},
  },
  trustedShareURLs: ['bit.ly/*', 'fw.to/*', 'shr.gs/*', 'vst.to/*', 'socli.ru/*', 's.gigya-api.cn/*'],
  enableDataSharing: true,
  isCDP: false,
  invisibleRecaptcha: {
    SiteKey: '',
    Secret: '',
  },
  recaptchaV2: {
    SiteKey: '6LfDRQwcAAAAADiyEXojwPmYhK7nAQcPMIZ11111',
    Secret: '6LfDRQwcAAAAAKz1pJzCivvxbxT7sGRAOU722222',
  },
  funCaptcha: {
    SiteKey: '',
    Secret: '',
  },
  customAPIDomainPrefix: '',
}

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
  errorToManualRemoveSiteMessage,
  emailTemplateExportError,
  smsTemplateExportError,
  smsTemplateSuccessResponse,
  siteConfigResponse,
}
