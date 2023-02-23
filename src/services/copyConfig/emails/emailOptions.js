import Options from '../options'

class EmailOptions extends Options {
  #emailConfiguration


  constructor(emailConfiguration) {
    const emailTemplates = 'emailTemplates'
    const magicLink = 'agicLink'
    const codeVerification = 'CodeVerification'
    const emailVerification = 'EmailVerification'
    const newUserWelcome = 'ewUserWelcome'
    const accountDeletionConfirmation = 'ccountDeletionConfirmation'
    const litePreferencesCenter = 'itePreferencesCenter'
    const doubleOptInConfirmation = 'oubleOptInConfirmation'
    const passwordReset = 'PasswordReset'
    const tfaEmailVerification = 'EmailVerification'
    const impossibleTraveler = 'mpossibleTraveler'
    const passwordResetConfirmation = 'asswordResetConfirmation'
    super({
      id: emailTemplates,
      name: emailTemplates,
      value: true,
      branches: [
        {
          id: `m${magicLink}`,
          name: `M${magicLink}`,
          value: true,
        },
        {
          id: `et${codeVerification}`,
          name: codeVerification,
          value: true,
        },
        {
          id: `et${emailVerification}`,
          name: emailVerification,
          value: true,
        },
        {
          id: `n${newUserWelcome}`,
          name: `N${newUserWelcome}`,
          value: true,
        },
        {
          id: `a${accountDeletionConfirmation}`,
          name: `A${accountDeletionConfirmation}`,
          value: true,
        },
        {
          id: `l${litePreferencesCenter}`,
          name: `L${litePreferencesCenter}`,
          value: true,
        },
        {
          id: `d${doubleOptInConfirmation}`,
          name: `D${doubleOptInConfirmation}`,
          value: true,
        },
        {
          id: `et${passwordReset}`,
          name: passwordReset,
          value: true,
        },
        {
          id: `tfa${tfaEmailVerification}`,
          name: `TFA${tfaEmailVerification}`,
          value: true,
        },
        {
          id: `i${impossibleTraveler}`,
          name: `I${impossibleTraveler}`,
          value: true,
        },
        {
          id: `p${passwordResetConfirmation}`,
          name: `P${passwordResetConfirmation}`,
          value: true,
        },
      ],
    })
    this.#emailConfiguration = emailConfiguration
  }

  getConfiguration() {
    return this.#emailConfiguration
  }

  removePasswordResetConfirmation(info) {
    return this.removeInfo('PasswordResetConfirmation', info)
  }

  removeImpossibleTraveler(info) {
    return this.removeInfo('ImpossibleTraveler', info)
  }

  removeTFAEmailVerification(info) {
    return this.removeInfo('TFAEmailVerification', info)
  }

  removePasswordReset(info) {
    return this.removeInfo('PasswordReset', info)
  }

  removeDoubleOptInConfirmation(info) {
    return this.removeInfo('DoubleOptInConfirmation', info)
  }

  removeLitePreferencesCenter(info) {
    return this.removeInfo('LitePreferencesCenter', info)
  }

  removeAccountDeletionConfirmation(info) {
    return this.removeInfo('AccountDeletionConfirmation', info)
  }

  removeNewUserWelcome(info) {
    return this.removeInfo('NewUserWelcome', info)
  }

  removeEmailVerification(info) {
    return this.removeInfo('EmailVerification', info)
  }

  removeCodeVerification(info) {
    return this.removeInfo('CodeVerification', info)
  }

  removeMagicLink(info) {
    return this.removeInfo('MagicLink', info)
  }
}

export default EmailOptions
