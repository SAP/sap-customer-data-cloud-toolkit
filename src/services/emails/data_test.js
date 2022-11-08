const emailTemplate =
  '<html xmlns="http://www.w3.org/1999/xhtml">\r\n' +
  '<head>\r\n' +
  '<META name="from" content="Name <noreply@YOUR-SITE.com>" />\r\n' +
  '<META name="subject" content=" Login with magic link" />\r\n' +
  '</head>\r\n' +
  '<body style="font-family: Arial; font-size: 13px; line-height: 16px;">\r\n' +
  '<div style="background: url(\'https://cdns.gigya.com/site/images/email/background.png\') repeat-x; width: 720px; padding:13px 0; margin:0 auto;">\r\n' +
  '<div style="background: #fff; border-radius: 3px; margin: 0 auto; width: 693px; ">\r\n' +
  '<div style="padding:30px 30px 29px;margin: 0px auto;">\r\n' +
  '<p>Hello, </p>\r\n' +
  '<p>Please click the following <a href="$url">magic link</a> to login to &lt;domain&gt;.</p>\r\n' +
  '<p>If you have not tried to access your account, you may ignore this message.</p>\r\n' +
  '<p>Your &lt;sitename&gt; team</p>\r\n' +
  '</div>\r\n' +
  '</div>\r\n' +
  '</div>\r\n' +
  '</body>\r\n' +
  '</html>'

const getEmailsExpectedResponse = {
  callId: 'callId',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: Date.now(),
  magicLink: {
    defaultLanguage: 'en',
    urlPlaceHolder: '$url',
    emailTemplates: {
      en: emailTemplate,
      pt: emailTemplate,
    },
  },
  codeVerification: {
    defaultLanguage: 'en',
    codePlaceHolder: '$code',
    emailTemplates: {
      en: emailTemplate,
    },
  },
  emailVerification: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
    verificationEmailExpiration: 93600,
    autoLogin: true,
  },
  emailNotifications: {
    welcomeEmailTemplates: {
      ar: emailTemplate,
    },
    welcomeEmailDefaultLanguage: 'ar',
    accountDeletedEmailTemplates: {
      'pt-br': emailTemplate,
    },
    accountDeletedEmailDefaultLanguage: 'pt-br',
    confirmationEmailTemplates: {
      'pt-br': emailTemplate,
    },
    confirmationEmailDefaultLanguage: 'en',
  },
  preferencesCenter: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
    linkPlaceHolder: '$link',
  },
  doubleOptIn: {
    defaultLanguage: 'en',
    confirmationEmailTemplates: {
      ar: emailTemplate,
    },
    nextURL: 'https://socialize.eu1.gigya.com/gs/confirmSubscriptions.aspx',
    nextExpiredURL: 'https://socialize.eu1.gigya.com/gs/LinkExpired.aspx',
    confirmationLinkExpiration: 7200,
  },
  passwordReset: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
    requireSecurityCheck: false,
    resetURL: '',
    tokenExpiration: 3600,
    sendConfirmationEmail: false,
  },
  twoFactorAuth: {
    providers: [
      {
        name: 'gigyaPhone',
        enabled: true,
      },
      {
        name: 'gigyaEmail',
        enabled: false,
      },
      {
        name: 'gigyaTotp',
        enabled: false,
      },
      {
        name: 'gigyaPush',
        enabled: false,
        params: {
          defaultRuleset: '_off',
        },
      },
    ],
    emailProvider: {
      defaultLanguage: 'en',
      emailTemplates: {
        en: emailTemplate,
      },
    },
    smsProvider: {},
  },
  impossibleTraveler: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
  },
  unknownLocationNotification: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
  },
  passwordResetNotification: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
  },
}

function getEmailsExpectedResponseWithMinimumTemplates() {
  const clone = JSON.parse(JSON.stringify(getEmailsExpectedResponse))
  deleteContent(clone)
  return clone
}

function getExpectedExportConfigurationFileContentWithMinimumTemplates() {
  const clone = JSON.parse(JSON.stringify(expectedExportConfigurationFileContent))
  deleteContent(clone)
  return clone
}

function deleteContent(clone) {
  delete clone.emailNotifications.accountDeletedEmailTemplates
  delete clone.emailNotifications.confirmationEmailTemplates
  //delete clone.emailNotifications.welcomeEmailTemplates
  delete clone.emailVerification
  delete clone.impossibleTraveler.emailTemplates
}

const expectedExportConfigurationFileContent = {
  callId: 'callId',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: getEmailsExpectedResponse.time,
  magicLink: {
    defaultLanguage: 'en',
    urlPlaceHolder: '$url',
    emailTemplates: {
      en: 'MagicLink/en.html',
      pt: 'MagicLink/pt.html',
    },
  },
  codeVerification: {
    defaultLanguage: 'en',
    codePlaceHolder: '$code',
    emailTemplates: {
      en: 'CodeVerification/en.html',
    },
  },
  emailVerification: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: 'EmailVerification/en.html',
    },
    verificationEmailExpiration: 93600,
    autoLogin: true,
  },
  emailNotifications: {
    welcomeEmailTemplates: {
      ar: 'NewUserWelcome/ar.html',
    },
    welcomeEmailDefaultLanguage: 'ar',
    accountDeletedEmailTemplates: {
      'pt-br': 'AccountDeletionConfirmation/pt-br.html',
    },
    accountDeletedEmailDefaultLanguage: 'pt-br',
    confirmationEmailTemplates: {
      'pt-br': 'PasswordResetConfirmation/pt-br.html',
    },
    confirmationEmailDefaultLanguage: 'en',
  },
  preferencesCenter: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: 'LitePreferencesCenter/en.html',
    },
    linkPlaceHolder: '$link',
  },
  doubleOptIn: {
    defaultLanguage: 'en',
    confirmationEmailTemplates: {
      ar: 'DoubleOptInConfirmation/ar.html',
    },
    nextURL: 'https://socialize.eu1.gigya.com/gs/confirmSubscriptions.aspx',
    nextExpiredURL: 'https://socialize.eu1.gigya.com/gs/LinkExpired.aspx',
    confirmationLinkExpiration: 7200,
  },
  passwordReset: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: 'PasswordReset/en.html',
    },
    requireSecurityCheck: false,
    resetURL: '',
    tokenExpiration: 3600,
    sendConfirmationEmail: false,
  },
  twoFactorAuth: {
    providers: [
      {
        name: 'gigyaPhone',
        enabled: true,
      },
      {
        name: 'gigyaEmail',
        enabled: false,
      },
      {
        name: 'gigyaTotp',
        enabled: false,
      },
      {
        name: 'gigyaPush',
        enabled: false,
        params: {
          defaultRuleset: '_off',
        },
      },
    ],
    emailProvider: {
      defaultLanguage: 'en',
      emailTemplates: {
        en: 'TFAEmailVerification/en.html',
      },
    },
    smsProvider: {},
  },
  impossibleTraveler: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: 'ImpossibleTraveler/en.html',
    },
  },
  unknownLocationNotification: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
  },
  passwordResetNotification: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: emailTemplate,
    },
  },
}

const badRequest = 'Bad Request'
const invalidApiParam = 'Invalid ApiKey parameter'
const expectedGigyaResponseInvalidAPI = {
  callId: 'callId',
  errorCode: 400093,
  errorDetails: invalidApiParam,
  errorMessage: invalidApiParam,
  apiVersion: 2,
  statusCode: 400,
  statusReason: badRequest,
  time: Date.now(),
}

const expectedGigyaInvalidUserKey = {
  callId: 'f1d05f0a260d4bf48283b10fc27c6d3d',
  errorCode: 403005,
  errorDetails: 'The supplied userkey was not found',
  errorMessage: 'Unauthorized user',
  apiVersion: 2,
  statusCode: 403,
  statusReason: 'Forbidden',
  time: Date.now(),
}

const expectedGigyaInvalidSecret = {
  callId: 'f1d05f0a260d4bf48283b10fc27c6d3d',
  errorCode: 403010,
  errorDetails: 'Invalid parameter: secret',
  errorMessage: 'Invalid Secret',
  apiVersion: 2,
  statusCode: 403,
  statusReason: 'Forbidden',
  time: Date.now(),
}

const credentials = {
  userKey: 'userKey',
  secret: 'secret',
}

export {
  credentials,
  expectedGigyaResponseInvalidAPI,
  expectedGigyaInvalidUserKey,
  expectedGigyaInvalidSecret,
  getEmailsExpectedResponse,
  getEmailsExpectedResponseWithMinimumTemplates,
  expectedExportConfigurationFileContent,
  getExpectedExportConfigurationFileContentWithMinimumTemplates,
}
