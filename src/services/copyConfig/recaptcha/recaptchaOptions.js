import Options from '../options.js'

class RecaptchaOptions extends Options {
  #recaptchaConfiguration

  constructor(recaptchaConfiguration) {
    super({
      id: 'recaptchaPolicies',
      name: 'reCAPTCHA Policies',
      formatName: false,
      value: true,
    })
    this.#recaptchaConfiguration = recaptchaConfiguration
  }

  getConfiguration() {
    return this.#recaptchaConfiguration
  }

  removeRecaptchaPolicies(info) {
    if (info && Array.isArray(info.branches)) {
      info.branches = []
    } else {
      console.warn('Recaptcha info is invalid or does not contain branches:', info)
    }
  }
}

export default RecaptchaOptions
