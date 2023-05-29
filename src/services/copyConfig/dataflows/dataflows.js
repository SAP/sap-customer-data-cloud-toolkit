import generateErrorResponse from '../../errors/generateErrorResponse'
import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'

class Dataflows {
  static #NAMESPACE = 'idx'
  static #GET_ENDPOINT = 'idx.getDataflow'
  static #SEARCH_ENDPOINT = 'idx.search'
  static #SET_ENDPOINT = 'idx.setDataflow'
  static #query = 'SELECT * FROM dataflow'
  static #ERROR_GET_DATAFLOW_CONFIG = 'Error retrieving dataflows'
  static #ERROR_SET_DATAFLOW_CONFIG = 'Error setting dataflow configuration'

  constructor(credentials, apiKey, dataCenter) {
    this.userKey = credentials.userKey
    this.secret = credentials.secret
    this.originApiKey = apiKey
    this.originDataCenter = dataCenter
  }

  async get(data) {
    const url = UrlBuilder.buildUrl(Dataflows.#NAMESPACE, this.originDataCenter, Dataflows.#GET_ENDPOINT)
    const response = await client.post(url, this.#getDataflowConfigParameters(this.originApiKey, this.getResults(data))).catch(function (error) {
      return generateErrorResponse(error, Dataflows.#ERROR_GET_DATAFLOW_CONFIG)
    })

    return response
  }

  async set(apiKey, data) {
    const url = UrlBuilder.buildUrl(Dataflows.#NAMESPACE, this.originDataCenter, Dataflows.#GET_ENDPOINT)
    const response = await client.post(url, this.#setDataflowConfigParameters(apiKey, data)).catch(function (error) {
      return generateErrorResponse(error, Dataflows.#ERROR_GET_DATAFLOW_CONFIG)
    })

    return response.data
  }

  getResults(response) {
    let result = []
    for (const responseResult of response.result) {
      result.push(responseResult.id)
    }
    return result
  }

  async search() {
    const url = UrlBuilder.buildUrl(Dataflows.#NAMESPACE, this.originDataCenter, Dataflows.#SEARCH_ENDPOINT)
    const response = await client.post(url, this.#searchtDataflowConfigParameters(this.originApiKey, Dataflows.#query)).catch(function (error) {
      return generateErrorResponse(error, Dataflows.#ERROR_GET_DATAFLOW_CONFIG)
    })

    return response.data
  }

  async copy(destinationAPI, options) {
    let response = await this.search()

    let getDataflow = await this.get(response)

    if (getDataflow.errorCode === 0) {
      await this.set(destinationAPI, getDataflow)
    }

    return response
  }

  #searchtDataflowConfigParameters(apiKey, query) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.query = query

    return parameters
  }

  #getDataflowConfigParameters(apiKey, config) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.id = config
    parameters.format = 'json'
    return parameters
  }

  #setDataflowConfigParameters(apiKey, config) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.userKey
    parameters.secret = this.secret
    parameters.data = JSON.stringify(config)
    parameters.format = 'json'
    return parameters
  }
}

export default Dataflows
