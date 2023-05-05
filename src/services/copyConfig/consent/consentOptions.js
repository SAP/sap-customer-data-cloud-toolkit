import Options from '../options'

class ConsentOptions extends Options {
  #consentConfiguration

  constructor(consentConfiguration) {
    super({
      id: 'consent',
      name: 'consentStatements',
      value: true,
    })
    this.#consentConfiguration = consentConfiguration
  }

  getConfiguration() {
    return this.#consentConfiguration
  }

  removeConsent(info) {
    info.branches = []
  }
}

export default ConsentOptions
