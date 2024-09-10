/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { format } from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
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

  async specificScreenSet(specificScreenSet, siteApiKey, javascript, response) {
    const screenSetArray = []
    let success = true
    let error = null
    try {
      if (javascript) {
        specificScreenSet.javascript = await this.myFormat(javascript)
        screenSetArray.push(specificScreenSet.screenSetID)
        await this.#copyScreenSet(siteApiKey, specificScreenSet.screenSetID, this.#dataCenter, response)
        return { success, screenSetArray, error }
      } else {
        error = `There is no Javascript on this screen ${specificScreenSet.screenSetID}`
      }
    } catch (err) {
      success = false
      error = `Error formatting ScreenSet ID ${specificScreenSet.screenSetID}: ${err.message}`
    }
    return { success, screenSetArray, error }
  }

  async prettifyAllScreens(screenSet, siteApiKey, javascript, response, screenSetID) {
    let success = true
    let error = null
    const screenSetArray = []
    try {
      if (javascript) {
        screenSet.javascript = await this.myFormat(javascript)
        screenSetArray.push(screenSetID)
        await this.#copyScreenSet(siteApiKey, screenSetID, this.#dataCenter, response)
        return { success, screenSetArray, error }
      }
    } catch (err) {
      success = false
      error = `Error formatting ScreenSet ID ${screenSetID}: ${err.message}`
    }
    return { success, screenSetArray, error }
  }

  async prettierCode(siteApiKey, screenSetClicked = undefined) {
    const response = await this.get()
    const allScreenSetArrays = []
    let success = true
    let error = null
    for (const screenSet of response.screenSets) {
      const { screenSetID, javascript } = screenSet
      if (screenSetClicked === screenSetID) {
        const { success, screenSetArray, error } = await this.specificScreenSet(screenSet, siteApiKey, javascript, response)

        return { success, screenSetArray, error }
      }
      if (screenSetClicked === undefined) {
        const result = await this.prettifyAllScreens(screenSet, siteApiKey, javascript, response, screenSetID)
        if (!result.success) {
          return { success: result.success, screenSetArray: allScreenSetArrays, error: result.error }
        }

        if (result.error) {
          error = error ? `${error}\n${result.error}` : result.error
        }
        allScreenSetArrays.push(...result.screenSetArray)
      }
    }
    if (allScreenSetArrays.length === 0) {
      error = `There is no Javascript on any screen`
    }
    return { success, screenSetArray: allScreenSetArrays, error }
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
