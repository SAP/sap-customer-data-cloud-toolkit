/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { format } from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import { stringToJson } from '../copyConfig/objectHelper.js'
import UrlBuilder from '../gigya/urlBuilder.js'
import generateErrorResponse from '../errors/generateErrorResponse.js'
import client from '../gigya/client.js'

class StringPrettierFormatter {
  static #ERROR_MSG_GET_CONFIG = 'Error getting screen sets'
  static #ERROR_MSG_SET_CONFIG = 'Error setting screen sets'
  static #NAMESPACE = 'accounts'
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  async get() {
    const url = UrlBuilder.buildUrl(StringPrettierFormatter.#NAMESPACE, this.#dataCenter, StringPrettierFormatter.getGetScreenSetEndpoint(), this.#credentials.gigyaConsole)
    const res = await client.post(url, this.#getScreenSetParameters(this.#site)).catch(function (error) {
      return generateErrorResponse(error, StringPrettierFormatter.#ERROR_MSG_GET_CONFIG)
    })

    return res.data
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(StringPrettierFormatter.#NAMESPACE, dataCenter, StringPrettierFormatter.getSetScreenSetEndpoint(), this.#credentials.gigyaConsole)
    const res = await client.post(url, this.#setScreenSetParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, StringPrettierFormatter.#ERROR_MSG_SET_CONFIG)
    })

    return res.data
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.get()

    if (response.errorCode === 0) {
      response = await this.copyScreenSets(destinationSite, destinationSiteConfiguration.dataCenter, response, options)
    }
    stringToJson(response, 'context')

    return response
  }

  async prettierCode(screenSetClicked, siteApiKey) {
    const response = await this.get()
    const screenSets = []
    let success = true
    let error = null
    for (const screenSet of response.screenSets) {
      const { screenSetID, javascript } = screenSet

      if (screenSetClicked === screenSetID && javascript) {
        try {
          screenSet.javascript = await this.myFormat(javascript)
          screenSets.push(screenSet.screenSetID)
          console.log('screenSet-1', screenSets)
          await this.#copyScreenSet(siteApiKey, screenSetID, this.#dataCenter, response)
          success = true
        } catch (err) {
          error = `Error formatting ScreenSet ID ${screenSetID}: ${err.message}`
          break
        }
      }
      if (screenSetClicked === undefined) {
        if (javascript) {
          try {
            screenSet.javascript = await this.myFormat(javascript)
            screenSets.push(screenSet.screenSetID)
            console.log('screenSet-2', screenSets)

            await this.#copyScreenSet(siteApiKey, screenSetID, this.#dataCenter, response)
            success = false
          } catch (err) {
            error = `Error formatting ScreenSet ID ${screenSetID}: ${err.message}`
            break
          }
        }
      }
    }

    return { success, screenSets, error }
  }

  #getScreenSetParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters.include = 'screenSetID,html,css,javascript,translations,metadata'

    parameters.context = JSON.stringify({ id: 'screenSet', targetApiKey: apiKey })

    return parameters
  }

  #setScreenSetParameters(apiKey, body) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    parameters['screenSetID'] = body.screenSetID
    parameters['html'] = body.html
    if (body.css) {
      parameters['css'] = body.css
    }
    if (body.javascript) {
      parameters['javascript'] = body.javascript
    }
    if (body.translations) {
      parameters['translations'] = JSON.stringify(body.translations)
    }
    if (body.metadata) {
      parameters['metadata'] = JSON.stringify(body.metadata)
    }
    parameters['context'] = JSON.stringify({ id: body.screenSetID, targetApiKey: apiKey })
    return parameters
  }

  static getGetScreenSetEndpoint() {
    return `${StringPrettierFormatter.#NAMESPACE}.getScreenSets`
  }

  static getSetScreenSetEndpoint() {
    return `${StringPrettierFormatter.#NAMESPACE}.setScreenSet`
  }

  async copyScreenSets(destinationSite, dataCenter, response, options) {
    const promises = []
    for (const screenSetCollectionInfo of options.getOptions().branches) {
      for (const screenSetInfo of screenSetCollectionInfo.branches) {
        if (screenSetInfo.value) {
          const index = response.screenSets.findIndex((arrayId) => arrayId.screenSetID === screenSetInfo.id)
          response.screenSets[index].javascript = await this.myFormat(response.screenSets[index].javascript)
          promises.push(this.#copyScreenSet(destinationSite, screenSetInfo.name, dataCenter, response))
        }
      }
    }
    return Promise.all(promises)
  }

  #copyScreenSet(destinationSite, screenSetID, dataCenter, response) {
    const screenSet = this.#getScreenSet(screenSetID, response)
    return this.set(destinationSite, dataCenter, screenSet)
  }

  #getScreenSet(screenSetID, response) {
    return response.screenSets.find((obj) => obj.screenSetID === screenSetID)
  }

  async myFormat(_inputString) {
    const prettierConfig = {
      parser: 'babel',
      plugins: [prettierPluginBabel, prettierPluginEstree],
      tabWidth: 4,
    }

    const withExportDefault = `export default ${_inputString.trimStart()}`

    try {
      const formattedString = await format(withExportDefault, prettierConfig)
      return formattedString.replace(/^export default\s*/, '')
    } catch (error) {
      console.error('Error formatting string:', error.message)
      throw error // Re-throw the error to handle it in the calling code
    }
  }
}

export default StringPrettierFormatter