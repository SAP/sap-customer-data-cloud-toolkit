import Options from '../options'

class EmailOptions extends Options {
  #emailConfiguration

  constructor(emailConfiguration) {
    super({
      id: 'emailTemplates',
      name: 'emailTemplates',
      value: true,
      branches: [
        {
          id: 'magicLink',
          name: 'MagicLink',
          value: true,
        },
        {
          id: 'etCodeVerification',
          name: 'CodeVerification',
          value: true,
        },
        {
          id: 'etEmailVerification',
          name: 'EmailVerification',
          value: true,
        },
        {
          id: 'newUserWelcome',
          name: 'NewUserWelcome',
          value: true,
        },
        {
          id: 'accountDeletionConfirmation',
          name: 'AccountDeletionConfirmation',
          value: true,
        },
        {
          id: 'litePreferencesCenter',
          name: 'LitePreferencesCenter',
          value: true,
        },
        {
          id: 'doubleOptInConfirmation',
          name: 'DoubleOptInConfirmation',
          value: true,
        },
        {
          id: 'etPasswordReset',
          name: 'PasswordReset',
          value: true,
        },
        {
          id: 'tfaEmailVerification',
          name: 'TFAEmailVerification',
          value: true,
        },
        {
          id: 'impossibleTraveler',
          name: 'ImpossibleTraveler',
          value: true,
        },
        {
          id: 'passwordResetConfirmation',
          name: 'PasswordResetConfirmation',
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
