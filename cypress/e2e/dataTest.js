const baseDomain = 'a_b_c_site_deployer'
const dropdownOption = 'Dev, Stag, Prod with Parent and Child (ex: dev.eu.parent.siteDomain, dev.eu.siteDomain)'
const consoleUrl = 'http://console.gigya.com'
const currentSiteName = ' dev.cdc-tools '
const baseDomainName = 'e2e_testing'
const siteSelectorOption = 'Site Selector'
const smsTemplatesOption = 'SMS Templates'
const parentBaseDomain = 'Manually add parent site'
const parentSiteDescription = 'Manually added description'
const expectedErrorMessage = 'Missing required parameter (Manually add parent site - eu1)Missing required parameter : partnerID'
const expectedSuccessMessage = 'OkAll sites have been created successfully.'
const childrenBaseDomain = 'Children site domain'
const childrenSiteDescription = 'Children site description'
const missingCredentialsErrorMessage = 'OkPlease insert User and Secret Keys in the Credentials menu.'
const emailTemplatesExportErrorHeaderMessage = 'Error - email templates were not exported'
const emailTemplatesExportErrorMessage = 'Error getting email templates'
const emailTemplatesExportErrorMessageDetail =
  'Error getting email templatesThere was an error when getting the email templates or you do not have the required permissions to call it.'
const emailTemplatesIconName = 'Email Templates'
const siteDeployerIconName = 'Site Deployer'
const emailExampleFile = 'email-templates.zip'
const smsExampleFile = 'sms-templates.zip'
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
const copyConfigExtendendMenuOption = 'Copy Config. Extended'
const copyConfigExtendendTitle = 'Copy Configuration Extended'
const copyConfigExtendendHeaderText = 'Copy configuration and settings from the current site to multiple target sites.'
const copyConfigCurrentSiteLabel = 'Current Site:'
const copyConfigCurrentSiteApiKeyLabel = 'API Key:'
const copyConfigDestinationSiteLabel = 'Destination Site:'
const copyConfigTargetSitesApisLabel = 'Target Sites API Keys:'
const copyConfigSuccessPopupMessage = 'OkAll selected configurations were copied successfully.'
const dummyApiKey = '4_-DiwrECcjcMVrRyIX8aukA'

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
  baseDomain: 'dev.cdc-tools',
  dataCenter: 'eu1',
  trustedSiteURLs: ['*.dev.cdc-tools/*', 'dev.cdc-tools/*'],
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

const mockedGetSchemaResponse = {
  callId: '7a4f360936fe4e4d8374cbf5c7f2ea83',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-02T22:20:47.326Z',
  profileSchema: {
    fields: {},
    dynamicSchema: false,
  },
  dataSchema: {
    fields: {},
    dynamicSchema: true,
  },
  subscriptionsSchema: {
    fields: {},
  },
  preferencesSchema: {
    fields: {},
  },
}

const mockedGetSmsConfigsResponse = {
  callId: '7ece88aa651b40a4ac7abc64d998c57b',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-03T15:42:15.820Z',
  templates: {
    otp: {
      globalTemplates: {
        templates: {
          en: 'Your verification code is: {{code}}',
          nl: 'Uw verificatiecode is: {{code}}',
          it: 'Il tuo codice di verifica è: {{code}}',
          es: 'El código de verificación es: {{code}}',
          ar: 'رمز التحقق الخاص بك هو:{{code}}',
          br: 'Вашият код за потвърждение е: {{code}}',
          ca: 'El teu codi de verificació és: {{code}}',
          'zh-hk': '你既驗證碼係: {{code}}',
          'zh-tw': '您的驗証碼是: {{code}}',
          'zh-cn': '您的验证码是： {{code}}',
          hr: 'Váš ověřovací kód je: {{code}}',
          da: 'Din bekræftelseskode er: {{code}}',
          fi: 'Vahvistuskoodisi on: {{code}}',
          fr: 'Votre code de vérification est: {{code}}',
          de: 'Ihr Bestätigungscode lautet: {{code}}',
          el: 'Ο κωδικός επαλήθευσής σας είναι: {{code}}',
          he: '{{code}} :קוד האישור שלך הוא',
          hi: 'आपका सत्यापन कोड यह है: {{code}}',
          hu: 'A megerősítő kódod: {{code}}',
          id: 'Kode verifikasi Anda adalah: {{code}}',
          ja: '確認コードは次のとおりです: {{code}}',
          kn: 'ನಿಮ್ಮ ಸರಿಯಾದ ಕೋಡ್ ಏನೆ0ದರೆ: {{code}}',
          mr: 'तुमच्या सत्यापन कोड हा आहे: {{code}}',
          ko: '당신의 인증번호는: {{code}}',
          ms: 'Kod pengesahan anda ialah: {{code}}',
          pl: 'Twój kod weryfikacyjny to: {{code}}',
          pt: 'O seu código de verificação é: {{code}}',
          'pt-br': 'O seu código de verificação é: {{code}}',
          ro: 'Codul dvs. de verificare este: {{code}}',
          ru: 'Ваш код подтверждения: {{code}}',
          sr: 'Ваш верификациони код је: {{code}}',
          sk: 'Váš overovací kód je: {{code}}',
          sl: 'Vaša koda za potrditev je: {{code}}',
          'es-mx': 'Su código de verificación es: {{code}}',
          sv: 'Din verifieringskod är: {{code}}',
          tl: 'Ang iyong verification code ay: {{code}}',
          th: 'รหัสยืนยันของคุณคือ: {{code}}',
          tr: 'Onay kodunuz: {{code}}',
          uk: 'Ваш код підтвердження: {{code}}',
          vi: 'Mã xác minh của bạn là: {{code}}',
        },
        defaultLanguage: 'en',
      },
      templatesPerCountryCode: {},
    },
    tfa: {
      globalTemplates: {
        templates: {
          en: 'Your verification code is: {{code}}',
          nl: 'Je bevestigingscode is:{{code}}',
          it: 'Il tuo codice di verifica è:{{code}}',
          es: 'Su código de verificación es:{{code}}',
          ar: 'رمز التحقق الخاص بك هو:{{code}}',
          br: 'Вашият код за потвърждение е:{{code}}',
          ca: 'El teu codi de verificació és:{{code}}',
          cs: 'Váš ověřovací kód je:{{code}}',
          hr: 'Vaš verifikacijski kod je:{{code}}',
          da: 'Din bekræftelseskode er:{{code}}',
          fa: 'کد تایید شما عبارت است از:{{code}}',
          fi: 'Vahvistuskoodisi on:{{code}}',
          fr: 'Votre code de vérification est:{{code}}',
          de: 'Ihr Bestätigungscode lautet:{{code}}',
          el: 'Ο κωδικός επαλήθευσής σας είναι:{{code}}',
          he: 'קוד האישור שלך הוא:{{code}}',
          hi: 'आपका सत्यापन कोड यह है:{{code}}',
          hu: 'A megerősítő kódod:{{code}}',
          id: 'Kode verifikasi Anda adalah:{{code}}',
          ja: '確認コードは次のとおりです:{{code}}',
          kn: 'ನಿಮ್ಮ ಸರಿಯಾದ ಕೋಡ್ ಏನೆ0ದರೆ:{{code}}',
          mr: 'तुमच्या सत्यापन कोड हा आहे:{{code}}',
          no: 'Verifiseringskoden din er:{{code}}',
          ko: '당신의 인증번호는:{{code}}',
          ms: 'Kod pengesahan anda ialah:{{code}}',
          pl: 'Twój kod weryfikacyjny to:{{code}}',
          pt: 'O seu código de verificação é:{{code}}',
          'pt-br': 'O seu código de verificação é:{{code}}',
          ro: 'Codul dvs. de verificare este:{{code}}',
          ru: 'Ваш код подтверждения:{{code}}',
          sr: 'Ваш верификациони код је:{{code}}',
          sk: 'Váš overovací kód je:{{code}}',
          sl: 'Vaša koda za potrditev je:{{code}}',
          'es-mx': 'Su código de verificación es:{{code}}',
          sv: 'Din verifieringskod är:{{code}}',
          tl: 'Ang iyong verification code ay:{{code}}',
          th: 'รหัสยืนยันของคุณคือ:{{code}}',
          tr: 'Onay kodunuz:{{code}}',
          uk: 'Ваш код підтвердження:{{code}}',
          vi: 'Mã xác minh của bạn là:{{code}}',
          yyef: '你既驗證碼係:{{code}}',
          'zh-cn': '您的验证码是：{{code}}',
          'zh-tw': '您的驗証碼是:{{code}}',
        },
        defaultLanguage: 'en',
      },
      templatesPerCountryCode: {},
    },
  },
}

const mockedSetSchemaResponse = {
  callId: '0b4d8c50fdc0431491d6ed355228c787',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-03T22:14:38.376Z',
}

const mockedSetSmsTemplatesResponse = {
  callId: 'f88bef4a500440a2914e17c0c1177276',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-03T22:14:38.103Z',
}

const mockedGetSocialsConfigsResponse = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: '5bf7710401074665b02f9c75b5f7ce61',
  time: '2023-02-06T14:58:53.218Z',
  capabilities: 'none',
  settings: 'disableGooglePlusLoginScope',
  providers: {
    facebook: {
      app: {
        appID: '',
      },
      settings: {
        enableNativeSdk: false,
        canvasURL: '',
        version: '2.0',
        enableWebsite: false,
        enableRelationships: false,
        enableReligion: false,
        enableBirthday: false,
        enableCity: false,
        enableFriendsList: true,
        enableAboutMe: false,
        enableEducationHistory: false,
        enableWorkHistory: false,
        enableHometown: false,
        enableGender: false,
        useCNAME: false,
        httpsOnly: false,
      },
    },
    twitter: {
      app: {
        consumerKey: '',
      },
      settings: {
        includeEmail: false,
        useCNAME: false,
        httpsOnly: false,
      },
    },
    googleplus: {
      app: {
        consumerKey: '',
      },
      settings: {
        enableNativeSdk: false,
        useCNAME: false,
        httpsOnly: false,
      },
    },
    linkedin: {
      app: {
        apiKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    apple: {
      app: {
        ServiceID: '',
      },
      settings: {
        keyId: '',
        teamId: '',
        useCNAME: false,
        httpsOnly: false,
      },
    },
    yahoo: {
      app: {
        appID: '',
        consumerKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    microsoft: {
      app: {
        clientID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    foursquare: {
      app: {
        clientID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    renren: {
      app: {
        consumerKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    qq: {
      app: {
        appID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    sina: {
      app: {
        appKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    vkontakte: {
      app: {
        apiKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    mixi: {
      app: {
        consumerKey: '',
        identificationKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    yahoojapan: {
      app: {
        appID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    spiceworks: {
      app: {
        consumerKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    instagram: {
      app: {
        clientID: 'ef611346757d4af8a81cd39e414cde79',
        clientSecret: 'THE APPS SECRET KEY',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    odnoklassniki: {
      app: {
        publicKey: '',
        applicationID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    amazon: {
      app: {
        accessKey: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    xing: {
      app: {
        accessKeyID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    wechat: {
      app: {
        appID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    paypal: {
      app: {
        clientID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    line: {
      app: {
        clientID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    naver: {
      app: {
        clientID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    kakao: {
      app: {
        clientID: '',
      },
      settings: {
        useCNAME: false,
        httpsOnly: false,
      },
    },
    docCheck: {
      app: {
        clientID: '',
      },
      settings: {
        Language: 'com',
        useCNAME: false,
        httpsOnly: false,
      },
    },
  },
}

const mockedSetSocialsConfigsResponse = {
  callId: 'f88bef4a500440a2914e17c0c11455576',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-06T14:14:38.103Z',
}

const mockedSetSchemaErrorResponse = {
  callId: '9203bf0eed4b4e31802d4aa02e1ad6a4',
  errorCode: 500000,
  apiVersion: 2,
  statusCode: 200,
  errorMessage: 'Test error',
  statusReason: 'Error',
  time: '2023-02-08T12:03:36.046Z',
  id: 'dataSchemaId',
  targetApiKey: dummyApiKey,
}

export {
  baseDomain,
  dropdownOption,
  parentBaseDomain,
  parentSiteDescription,
  expectedErrorMessage,
  expectedSuccessMessage,
  childrenBaseDomain,
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
  baseDomainName,
  siteSelectorOption,
  smsTemplatesOption,
  errorToManualRemoveSiteMessage,
  emailTemplateExportError,
  smsTemplateExportError,
  smsTemplateSuccessResponse,
  siteConfigResponse,
  mockedGetSchemaResponse,
  copyConfigExtendendMenuOption,
  mockedGetSmsConfigsResponse,
  copyConfigExtendendTitle,
  copyConfigExtendendHeaderText,
  copyConfigCurrentSiteLabel,
  copyConfigCurrentSiteApiKeyLabel,
  copyConfigDestinationSiteLabel,
  copyConfigTargetSitesApisLabel,
  dummyApiKey,
  mockedSetSchemaResponse,
  mockedSetSmsTemplatesResponse,
  copyConfigSuccessPopupMessage,
  mockedGetSocialsConfigsResponse,
  mockedSetSocialsConfigsResponse,
  mockedSetSchemaErrorResponse,
  currentSiteName,
}
