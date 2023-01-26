export function getInfoExpectedResponse(supports) {
  return {
    schema: {
      data: supports,
      profile: supports,
    },
    screenSets: {
      default: {
        defaultLinkAccounts: supports,
        defaultLiteRegistration: supports,
      },
      custom: {
        customLinkAccounts: supports,
        customLiteRegistration: supports,
      },
    },
    policies: {
      accountOptions: supports,
      codeVerification: supports,
      emailNotifications: supports,
      emailVerification: supports,
      federation: supports,
      webSdk: supports,
      passwordComplexity: supports,
      passwordReset: supports,
      defaultProfilePhotoDimensions: supports,
      registration: supports,
      security: supports,
      twoFactorAuthenticationProviders: supports,
    },
    socialIdentities: supports,
    emailTemplates: {
      magicLink: supports,
      codeVerification: supports,
      emailVerification: supports,
      newUserWelcome: supports,
      accountDeletionConfirmation: supports,
      litePreferencesCenter: supports,
      doubleOptInConfirmation: supports,
      passwordReset: supports,
      tfaEmailVerification: supports,
      impossibleTraveler: supports,
      passwordResetConfirmation: supports,
    },
    smsTemplates: supports,
    dataflows: supports,
  }
}
