import Options from '../options'

class SmsOptions extends Options {
  #smsConfiguration

  constructor(smsConfiguration) {
    super({
      id: 'smsTemplates',
      name: 'smsTemplates',
      value: true,
    })
    this.#smsConfiguration = smsConfiguration
  }

  getConfiguration() {
    return this.#smsConfiguration
  }

  removeSmsTemplates(info) {
    info.branches = []
  }
}

export default SmsOptions
