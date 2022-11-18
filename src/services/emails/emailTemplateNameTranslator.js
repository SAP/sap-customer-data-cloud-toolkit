// The class EmailTemplateNameTranslator translates the templates' name used internally by gigya into templates' name as used in the UI, so the user can recognize them
class EmailTemplateNameTranslator {
  static #emailTemplatesName = new Map([
    ['magicLink', 'MagicLink'],
    ['codeVerification', 'CodeVerification'],
    ['emailVerification', 'EmailVerification'],
    ['welcomeEmailTemplates', 'NewUserWelcome'],
    ['accountDeletedEmailTemplates', 'AccountDeletionConfirmation'],
    ['preferencesCenter', 'LitePreferencesCenter'],
    ['doubleOptIn', 'DoubleOptInConfirmation'],
    ['passwordReset', 'PasswordReset'],
    ['twoFactorAuth', 'TFAEmailVerification'],
    ['impossibleTraveler', 'ImpossibleTraveler'],
    ['confirmationEmailTemplates', 'PasswordResetConfirmation'],
  ])

  static translate(internalName) {
    return EmailTemplateNameTranslator.#emailTemplatesName.get(internalName)
  }

  static exists(internalName) {
    return EmailTemplateNameTranslator.#emailTemplatesName.has(internalName)
  }
}

export default EmailTemplateNameTranslator
