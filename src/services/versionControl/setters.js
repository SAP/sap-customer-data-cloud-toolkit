/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { cleanResponse, cleanEmailResponse } from './dataSanitization'

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

// set CommunicationTopics (used for Channels and topics)
// export const setCommunicationTopics = async function (config) {
//   for (const topic of config.topics) {
//     await this.communication.set(this.apiKey, this.dataCenter, topic)
//   }
// }
