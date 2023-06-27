/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import UrlBuilder from '../../gigya/urlBuilder'
import client from '../../gigya/client'
import generateErrorResponse from '../../errors/generateErrorResponse'
import { stringToJson } from '../objectHelper'

class Dataflow {
  static #ERROR_MSG_SET_CONFIG = 'Error setting dataflows'
  static #ERROR_MSG_CREATE_CONFIG = 'Error creating dataflows'
  static #ERROR_MSG_SEARCH_CONFIG = 'Error searching dataflows'
  static #NAMESPACE = 'idx'
  static #CONTEXT_ID = 'dataflows'
  static #encodedFields = ['script']
  static #ENCODED_FIELD_END_MARK = '"'
  static #DECODED_FIELD_END_MARK = '#-#"'
  #credentials
  #site
  #dataCenter

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
  }

  async set(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Dataflow.#NAMESPACE, dataCenter, Dataflow.#getSetDataflowEndpoint())
    const res = await client.post(url, this.#setDataflowParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, Dataflow.#ERROR_MSG_SET_CONFIG)
    })
    return res.data
  }

  async create(site, dataCenter, body) {
    const url = UrlBuilder.buildUrl(Dataflow.#NAMESPACE, dataCenter, Dataflow.#getCreateDataflowEndpoint())
    const res = await client.post(url, this.#setDataflowParameters(site, body)).catch(function (error) {
      return generateErrorResponse(error, Dataflow.#ERROR_MSG_CREATE_CONFIG)
    })
    return res.data
  }

  async search() {
    const promises = []
    promises.push(this.#searchDataflows('SELECT * FROM dataflow'))
    promises.push(this.#searchDataflows('SELECT * FROM dataflow_draft'))
    const dataflows = await Promise.all(promises)
    const errors = Dataflow.#getErrors(dataflows)
    if (errors.length > 0) {
      return errors[0]
    }

    return Dataflow.#mergeDataflows(dataflows)
  }

  async #searchDataflows(query) {
    const url = UrlBuilder.buildUrl(Dataflow.#NAMESPACE, this.#dataCenter, Dataflow.#getSearchDataflowEndpoint())
    const res = await client.post(url, this.#searchDataflowParameters(this.#site, query)).catch(function (error) {
      return generateErrorResponse(error, Dataflow.#ERROR_MSG_SEARCH_CONFIG)
    })
    return res.data
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let response = await this.search()
    if (response.errorCode === 0) {
      response = await this.#copyDataflows(destinationSite, destinationSiteConfiguration, response, options)
      Dataflow.#ignoreRedundantOperationError(response)
    }
    stringToJson(response, 'context')
    return Array.isArray(response) ? response : [response]
  }

  static #ignoreRedundantOperationError(response) {
    response.forEach((resp) => {
      if (resp.errorCode === 403200 && resp.errorMessage === 'Redundant Operation') {
        resp.errorCode = 0
        resp.statusCode = 200
        resp.statusReason = 'OK'
      }
    })
  }

  static #getErrors(responses) {
    return responses.filter((resp) => resp.errorCode !== 0)
  }

  #authenticationDataflowParameters(apiKey) {
    const parameters = Object.assign({})
    parameters.apiKey = apiKey
    parameters.userKey = this.#credentials.userKey
    parameters.secret = this.#credentials.secret
    return parameters
  }

  #searchDataflowParameters(apiKey, query) {
    const parameters = Object.assign({}, this.#authenticationDataflowParameters(apiKey))
    parameters.query = query
    parameters.context = JSON.stringify({ id: `${Dataflow.#CONTEXT_ID}_search`, targetApiKey: apiKey })
    return parameters
  }

  #setDataflowParameters(apiKey, body) {
    const parameters = Object.assign({}, this.#authenticationDataflowParameters(apiKey))
    parameters.data = JSON.stringify(body)
    return parameters
  }

  static #getSetDataflowEndpoint() {
    return `${Dataflow.#NAMESPACE}.setDataflow`
  }

  static #getCreateDataflowEndpoint() {
    return `${Dataflow.#NAMESPACE}.createDataflow`
  }

  static #getSearchDataflowEndpoint() {
    return `${Dataflow.#NAMESPACE}.search`
  }

  async #copyDataflows(destinationSite, destinationSiteConfiguration, response, options) {
    const promises = []
    const destinationSiteDataflows = await this.#getSiteDataflows(destinationSite, destinationSiteConfiguration.dataCenter)
    if (destinationSiteDataflows.errorCode !== 0) {
      return [destinationSiteDataflows]
    }
    for (const dataflow of options.getOptions().branches) {
      if (dataflow.value) {
        promises.push(this.#copyDataflow(destinationSite, destinationSiteConfiguration.dataCenter, dataflow.name, response, destinationSiteDataflows, dataflow.variables))
      }
    }
    return Promise.all(promises)
  }

  async #getSiteDataflows(destinationSite, dataCenter) {
    return new Dataflow(this.#credentials, destinationSite, dataCenter).search()
  }

  async #copyDataflow(destinationSite, dataCenter, name, sourceSiteDataflows, destinationSiteDataflows, dataflowVariables) {
    let sourceSiteDataflow = Dataflow.#findDataflow(sourceSiteDataflows, name)
    if (dataflowVariables) {
      sourceSiteDataflow = Dataflow.#replaceVariables(sourceSiteDataflow, dataflowVariables)
    }
    const destinationSiteDataflow = Dataflow.#findDataflow(destinationSiteDataflows, sourceSiteDataflow.name)
    if (destinationSiteDataflow) {
      // we are doing a modify the id must be the one from the destination extension
      sourceSiteDataflow.id = destinationSiteDataflow.id
      return this.set(destinationSite, dataCenter, sourceSiteDataflow)
    } else {
      return this.create(destinationSite, dataCenter, sourceSiteDataflow)
    }
  }

  static #findDataflow(dataflows, name) {
    return dataflows.result === undefined
      ? undefined
      : dataflows.result.find((df) => {
          return df.name === name
        })
  }

  static #mergeDataflows(dataflows) {
    const response = []
    for (const resp of dataflows) {
      if (response.length === 0) {
        response.push(resp)
      } else if (resp.result) {
        response[0].result.push(...resp.result)
        response[0].resultCount += resp.resultCount
        response[0].totalCount += resp.totalCount
      }
    }
    return response[0]
  }

  static decodeDataflow(dataflow) {
    let dataflowStr = JSON.stringify(dataflow)

    for (const field of Dataflow.#encodedFields) {
      dataflowStr = Dataflow.#decodeField(`"${field}"`, dataflowStr)
    }
    return dataflowStr
  }

  static #decodeField(field, dataflowStr) {
    return Dataflow.#processField(field, dataflowStr, atob, Dataflow.#ENCODED_FIELD_END_MARK)
  }

  static encodeDataflow(dataflowStr) {
    for (const field of Dataflow.#encodedFields) {
      dataflowStr = Dataflow.#encodeField(`"${field}"`, dataflowStr)
    }
    return dataflowStr
  }

  static #encodeField(field, dataflowStr) {
    return Dataflow.#processField(field, dataflowStr, btoa, Dataflow.#DECODED_FIELD_END_MARK)
  }

  static #processField(field, dataflowStr, codecFunction, fieldEndMark) {
    let idx = 0
    while (idx < dataflowStr.length) {
      idx = dataflowStr.indexOf(field, idx)
      if (idx === -1) {
        break
      }
      const valueStart = idx + field.length + 2
      let valueEnd = dataflowStr.indexOf(fieldEndMark, valueStart)
      let value = codecFunction(dataflowStr.substring(valueStart, valueEnd))
      if (fieldEndMark === Dataflow.#DECODED_FIELD_END_MARK) {
        valueEnd += Dataflow.#DECODED_FIELD_END_MARK.length - 1
      } else {
        value += Dataflow.#DECODED_FIELD_END_MARK.substring(0, Dataflow.#DECODED_FIELD_END_MARK.length - 1)
      }
      dataflowStr = dataflowStr.substring(0, valueStart) + value + dataflowStr.substring(valueEnd)
      idx = valueStart + value.length
    }
    return dataflowStr
  }

  static getVariables(dataflow) {
    return new Set(dataflow.match(/{{.*?}}/g))
  }

  static #replaceVariables(dataflow, variables) {
    let decodedDataflow = Dataflow.decodeDataflow(dataflow)
    for (const variable of variables) {
      const regex = new RegExp(variable.variable, 'g')
      decodedDataflow = decodedDataflow.replaceAll(regex, variable.value)
    }
    return JSON.parse(Dataflow.encodeDataflow(decodedDataflow))
  }
}

export default Dataflow
