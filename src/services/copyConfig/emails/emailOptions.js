import Options from '../options'

class EmailOptions extends Options {
  #emailConfiguration

  constructor(emailConfiguration) {
    super([{ id: 'emailTemplates', value: true }])
    this.#emailConfiguration = emailConfiguration
  }

  getConfiguration() {
    return this.#emailConfiguration
  }
}

export default EmailOptions
