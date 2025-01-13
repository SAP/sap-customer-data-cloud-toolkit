/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { cleanResponse, cleanEmailResponse } from './dataSanitization'
import Options from '../copyConfig/options'

// set Policies
export const setPolicies = async function (config) {
  cleanResponse(config)
  await this.policies.set(this.apiKey, config, this.dataCenter)
}

// set WebSDK
export const setWebSDK = async function (config) {
  await this.webSdk.set(this.apiKey, config, this.dataCenter)
}

// set SMS
export const setSMS = async function (config) {
  await this.sms.getSms().set(this.apiKey, this.dataCenter, config.templates)
}

// set Extension
export const setExtension = async function (config) {
  if (config.result.length) await this.extension.set(this.apiKey, this.dataCenter, config.result[0])
}

// set Schema
export const setSchema = async function (config) {
  for (let key in config) {
    if (config.hasOwnProperty(key)) {
      if (key === 'dataSchema') {
        await this.schema.set(this.apiKey, this.dataCenter, config.dataSchema)
      }
      if (key === 'addressesSchema') {
        await this.schema.set(this.apiKey, this.dataCenter, config.addressesSchema)
      }
      if (key === 'internalSchema') {
        await this.schema.set(this.apiKey, this.dataCenter, config.internalSchema)
      }
      if (key === 'profileSchema') {
        await this.schema.set(this.apiKey, this.dataCenter, config.profileSchema)
      }
      if (key === 'subscriptionsSchema') {
        await this.schema.set(this.apiKey, this.dataCenter, config.subscriptionsSchema)
      }
    }
  }
}

// set ScreenSets
export const setScreenSets = async function (config) {
  for (const screenSet of config.screenSets) {
    await this.screenSets.set(this.apiKey, this.dataCenter, screenSet)
  }
}

// set RBA
export const setRBA = async function (response) {
  if (response[0]) {
    await this.rba.setAccountTakeoverProtection(this.apiKey, response[0])
  }
  if (response[1]) {
    await this.rba.setUnknownLocationNotification(this.apiKey, this.siteInfo, response[1])
  }
  if (response[2]) {
    await this.rba.setRbaRulesAndSettings(this.apiKey, this.siteInfo, response[2])
  }
}

// set EmailTemplates
export const setEmailTemplates = async function (response) {
  cleanEmailResponse(response)
  for (let key in response) {
    if (key !== 'errorCode') {
      const result = await this.emails.getEmail().setSiteEmailsWithDataCenter(this.apiKey, key, response[key], this.dataCenter)
      console.log('resultEmails', result)
    }
  }
}

// set CommunicationTopics
export const setChannel = async function (config) {
  debugger
  for (const topic of config.Channels) {
    await this.communication.set(this.apiKey, this.dataCenter, topic)
  }
}

// set CommunicationTopics
export const setCommunicationTopics = async function (config) {
  // for (const topic of config.Channels) {
  //   await this.communication.copyFromGit(this.apiKey, this.dataCenter, topic)
  // }
  debugger
  if (config.Channels) {
    await this.communication.copyFromGit(this.apiKey, this.dataCenter, config.Channels, 'channel')
  }
  if (config.results) {
    await this.communication.copyFromGit(this.apiKey, this.dataCenter, config.results, 'topic')
  }
}

// Helper function to create Options object
const createOptions = (type, items, formatName = true) => {
  if (!Array.isArray(items)) {
    if (typeof items === 'object' && items !== null) {
      items = Object.values(items)
    } else {
      throw new TypeError(`Expected an array or object for items, but got ${typeof items}`)
    }
  }

  const optionsData = {
    id: type,
    name: type,
    value: false,
    formatName,
    branches: items.map((item) => ({
      id: item.name,
      name: item.name,
      value: true,
      formatName: false,
    })),
  }

  return new Options(optionsData)
}

// set Dataflow
export const setDataflow = async function (config) {
  const options = createOptions('dataflows', config.result)
  console.log('Dataflow Options created:', options.getOptions())
  await this.dataflow.copyDataflows(this.apiKey, this.siteInfo, config, options)
}

// set Webhook
export const setWebhook = async function (config) {
  const options = createOptions('webhooks', config.webhooks)
  console.log('Webhook Options created:', options.getOptions())
  await this.webhook.copyWebhooks(this.apiKey, this.dataCenter, config, options)
}

// set Consent
export const setConsent = async function (config) {
  const options = createOptions('consents', config.preferences)
  console.log('Consent Options created:', options.getOptions())
  await this.consent.copyFromGit(this.apiKey, this.dataCenter, config, options)
}

// set Dataflow
// export const setDataflow = async function (config) {
//   const options = {
//     options: {
//       id: 'dataflows',
//       name: 'dataflows',
//       value: false,
//       formatName: true,
//       branches: config.result.map((dataflow) => ({
//         id: dataflow.name,
//         name: dataflow.name,
//         value: true,
//         formatName: false,
//       })),
//     },
//   }
//   const optionsObj = new Options(options.options)
//   await this.dataflow.copyDataflows(this.apiKey, this.siteInfo, config, optionsObj)
// }

// export const setWebhook = async function (config) {
//   const optionsData = {
//     id: 'webhooks',
//     name: 'webhooks',
//     value: false,
//     formatName: true,
//     branches: config.webhooks.map((webhook) => ({
//       id: webhook.name,
//       name: webhook.name,
//       value: true,
//       formatName: false,
//     })),
//   }

//   const options = new Options(optionsData)
//   console.log('Webhook Options created:', options.getOptions())
//   debugger
//   await this.webhook.copyWebhooks(this.apiKey, this.dataCenter, config, options)
// }


//setConsents
//setRecaptcha
//setRiskAssessment
//setSocial
