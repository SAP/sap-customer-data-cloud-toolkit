/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


const emailTemplate =
  '<html xmlns="http://www.w3.org/1999/xhtml">\r\n' +
  '<head>\r\n' +
  '    <META name="from" content="Name &lt;noreply@YOUR-SITE.com&gt;" />\r\n' +
  '    <META name="subject" content=" Login with magic link" />\r\n' +
  '</head>\r\n' +
  '<body style="font-family: Arial; font-size: 13px; line-height: 16px;">\r\n' +
  '    <div style="background: url(\'background.png\') repeat-x; width: 720px; padding:13px 0; margin:0 auto;">\r\n' +
  '        <div style="background: #fff; border-radius: 3px; margin: 0 auto; width: 693px; ">\r\n' +
  '            <div style="padding:30px 30px 29px;margin: 0px auto;">\r\n' +
  '                <p>Hello, </p>\r\n' +
  '                <p>Please click the following <a href="$url">magic link</a> to login to &lt;domain&gt;.</p>\r\n' +
  '                <p>If you have not tried to access your account, you may ignore this message.</p>\r\n' +
  '                <p>Your &lt;sitename&gt; team</p>\r\n' +
  '            </div>\r\n' +
  '        </div>\r\n' +
  '    </div>\r\n' +
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
    nextURL: 'url/gs/confirmSubscriptions.aspx',
    nextExpiredURL: 'url/gs/LinkExpired.aspx',
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

function getEmailsExpectedResponseWithNoTemplates() {
  const clone = JSON.parse(JSON.stringify(getEmailsExpectedResponse))
  deleteContent(clone)
  delete clone.magicLink
  delete clone.codeVerification
  delete clone.preferencesCenter
  delete clone.doubleOptIn
  delete clone.passwordReset
  delete clone.twoFactorAuth
  delete clone.unknownLocationNotification
  delete clone.passwordResetNotification
  delete clone.emailNotifications
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
  delete clone.emailNotifications.welcomeEmailTemplates
  delete clone.emailVerification
  delete clone.impossibleTraveler
  // delete clone.unknownLocationNotification
  // delete clone.passwordResetNotification
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
    nextURL: 'url/gs/confirmSubscriptions.aspx',
    nextExpiredURL: 'url/gs/LinkExpired.aspx',
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
      en: 'UnknownLocationNotification/en.html',
    },
  },
  passwordResetNotification: {
    defaultLanguage: 'en',
    emailTemplates: {
      en: 'PasswordResetNotification/en.html',
    },
  },
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

const expectedGigyaImportTemplateWithoutMetaSubject = {
  callId: 'afa7d9bb1f164a2b9014fbba540bfd4a',
  errorCode: 400006,
  errorDetails:
    "Email template(s) must contain valid META 'subject' html headers'.\n On Property: 'Item1.CodeVerification.EmailTemplates[1].Value'Email template(s) must contain valid META 'from' html headers'.\n On Property: 'Item1.CodeVerification.EmailTemplates[1].Value'Email template(s) must contain link placeHolder $code'.\n On Property: 'Item1.CodeVerification.EmailTemplates[1].Value'",
  errorMessage: 'Invalid parameter value',
  apiVersion: 2,
  statusCode: 400,
  statusReason: 'Bad Request',
  time: Date.now(),
}

export {
  expectedGigyaInvalidSecret,
  expectedGigyaImportTemplateWithoutMetaSubject,
  getEmailsExpectedResponse,
  getEmailsExpectedResponseWithMinimumTemplates,
  getEmailsExpectedResponseWithNoTemplates,
  expectedExportConfigurationFileContent,
  getExpectedExportConfigurationFileContentWithMinimumTemplates,
  emailTemplate,
}
