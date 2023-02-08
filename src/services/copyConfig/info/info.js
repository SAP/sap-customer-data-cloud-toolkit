import Schema from '../schema/schema'
import { getInfoExpectedResponse } from './dataTest'
import Social from '../social/social'
import SmsConfiguration from '../sms/smsConfiguration'

class Info {
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  async get() {
    const response = []
    return Promise.all([
      this.#getSchema(),
      this.#getScreenSets(),
      this.#getPolicies(),
      this.#getSocialIdentities(),
      this.#getEmailTemplates(),
      this.#getSmsTemplates(),
      this.#getDataflows(),
    ]).then((infos) => {
      infos.forEach((info) => {
        if (info.branches === undefined || (info.branches !== undefined && info.branches.length > 0)) {
          response.push(info)
        }
      })
      return response
    })
  }

  async #getSchema() {
    const schema = new Schema(this.#credentials, this.#site, this.#dataCenter)
    const response = await schema.get()
    if (response.errorCode === 0) {
      const info = {
        id: 'schema',
        name: 'schema',
        value: false,
        branches: [],
      }
      if (response.dataSchema) {
        info.branches.push(this.#generateDataSchema())
      }
      if (response.profileSchema) {
        info.branches.push(this.#generateProfileSchema())
      }
      return Promise.resolve(info)
    } else {
      return Promise.reject([response])
    }
  }

  #generateDataSchema() {
    return {
      id: 'dataSchema',
      name: 'dataSchema',
      value: false,
    }
  }

  #generateProfileSchema() {
    return {
      id: 'profileSchema',
      name: 'profileSchema',
      value: false,
    }
  }

  async #getScreenSets() {
    return Promise.resolve(getInfoExpectedResponse(false)[1])
  }

  async #getPolicies() {
    return Promise.resolve(getInfoExpectedResponse(false)[2])
  }

  async #getSocialIdentities() {
    const social = new Social(this.#credentials, this.#site, this.#dataCenter)
    const response = await social.get()
    if (response.errorCode === 0) {
      const info = {
        id: 'socialIdentities',
        name: 'socialIdentities',
        value: false,
      }
      if (!this.#hasSocialProviders(response.providers)) {
        info.branches = []
      }
      return Promise.resolve(info)
    }
    return Promise.reject([response])
  }

  #getEmailTemplates() {
    return Promise.resolve(getInfoExpectedResponse(false)[4])
  }

  async #getSmsTemplates() {
    const smsConfiguration = new SmsConfiguration(this.#credentials, this.#site, this.#dataCenter)
    const response = await smsConfiguration.get()
    if (response.errorCode === 0) {
      const info = {
        id: 'smsTemplates',
        name: 'smsTemplates',
        value: false,
        branches: [],
      }
      if (response.templates) {
        delete info.branches
      }
      return Promise.resolve(info)
    } else {
      return Promise.reject([response])
    }
  }

  #getDataflows() {
    return Promise.resolve(getInfoExpectedResponse(false)[6])
  }

  #hasSocialProviders(providers) {
    let atLeastOneHasConfig = false
    for (const key in providers) {
      if (!Object.values(providers[key].app).every((x) => x === '')) {
        atLeastOneHasConfig = true
        break
      }
    }
    return atLeastOneHasConfig
  }
}

export default Info
