import Schema from '../schema/schema'
import { getInfoExpectedResponse } from './dataTest'

class Info {
  constructor(credentials, site, dataCenter) {
    this.credentials = credentials
    this.site = site
    this.dataCenter = dataCenter
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
    const schema = new Schema(this.credentials, this.site, this.dataCenter)
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
      return Promise.reject(response)
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

  #getSocialIdentities() {
    return Promise.resolve(getInfoExpectedResponse(false)[3])
  }

  #getEmailTemplates() {
    return Promise.resolve(getInfoExpectedResponse(false)[4])
  }

  #getSmsTemplates() {
    return Promise.resolve(getInfoExpectedResponse(false)[5])
  }

  #getDataflows() {
    return Promise.resolve(getInfoExpectedResponse(false)[6])
  }
}

export default Info
