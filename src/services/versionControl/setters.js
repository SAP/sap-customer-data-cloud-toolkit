// //Channels
// async function setFromFiles(destinationSite, destinationSiteConfiguration, content, fileType) {
//     let responses = []
//     switch (fileType) {
//       case 'channel':
//         const channelsPayload = Communication.#splitChannels(content)
//         for (const channel of channelsPayload) {
//           responses.push(this.#channel.set(destinationSite, destinationSiteConfiguration, channel))
//         }
//         break
//       case 'topic':
//         for (const topic of content) {
//           responses.push(this.#topic.set(destinationSite, destinationSiteConfiguration, topic))
//         }
//         break
//       default:
//         console.warn(`Unknown file type: ${content}`)
//     }

//     return await Promise.all(responses)
//   }

//   //Consents
//   async setFromFiles(destinationSite, dataCenter, content, options) {
//     let responses = []
//     if (options && options.value === false) {
//       return responses
//     }
//     const consentsPayload = ConsentConfiguration.#splitConsents(content.preferences)
//     responses.push(...(await this.copyConsentStatements(destinationSite, dataCenter, consentsPayload)))
//     // responses = responses.flat()
//     stringToJson(responses, 'context')
//     responses = ConsentConfiguration.#addSeverityToResponses(responses)
//     return responses
//   }

//   async setFromFiles(apiKey, dataCenter, config) {
//     try {
//       if (config.recaptchaConfig) {
//         await this.setRecaptchaConfig(apiKey, dataCenter, config.recaptchaConfig)
//       } else {
//         throw new Error('Recaptcha config is invalid or undefined.')
//       }

//       if (config.securityPolicies && config.registrationPolicies) {
//         await this.setPolicies(apiKey, dataCenter, config.securityPolicies, config.registrationPolicies)
//       } else {
//         throw new Error('Policies are invalid or undefined.')
//       }

//       if (config.riskProvidersConfig) {
//         await this.setRiskProvidersConfig(apiKey, dataCenter, config.riskProvidersConfig)
//       } else {
//         console.warn('Risk Providers config is invalid or undefined, skipping.')
//       }

//       console.log('Recaptcha config set from Git:', config)
//       return config
//     } catch (error) {
//       console.error('Error setting recaptcha config from Git:', error)
//       throw error
//     }
//   }
