/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { format } from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import ScreenSet from '../copyConfig/screenset/screenset.js'

class StringPrettierFormatter {
  static #NAMESPACE = 'accounts'
  #credentials
  #site
  #dataCenter
  #screenSet

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#screenSet = new ScreenSet(credentials, site, dataCenter)
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
    const response = await this.#screenSet.get()
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

  static getGetScreenSetEndpoint() {
    return `${StringPrettierFormatter.#NAMESPACE}.getScreenSets`
  }

  static getSetScreenSetEndpoint() {
    return `${StringPrettierFormatter.#NAMESPACE}.setScreenSet`
  }

  #copyScreenSet(destinationSite, screenSetID, dataCenter, response) {
    const screenSet = this.#getScreenSet(screenSetID, response)
    return this.#screenSet.set(destinationSite, dataCenter, screenSet)
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
