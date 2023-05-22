/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import Options from '../options'
import Dataflow from './dataflow'

class DataflowOptions extends Options {
  #dataflow

  constructor(dataflow) {
    super({
      id: 'dataflows',
      name: 'dataflows',
      value: true,
      formatName: true,
      branches: [],
    })
    this.#dataflow = dataflow
  }

  getConfiguration() {
    return this.#dataflow
  }

  add(response) {
    const dataflows = response.result
    this.options.branches = []
    if (dataflows.length === 0) {
      return
    }
    for (const dataflow of dataflows) {
      const decodedDataflow = Dataflow.decodeDataflow(dataflow)
      const variables = Dataflow.getVariables(decodedDataflow)
      const variablesObj = this.#buildVariablesObject(variables)
      const opt = {
        id: dataflow.name,
        name: dataflow.name,
        value: true,
        formatName: false,
      }
      if (variablesObj) {
        opt.variables = variablesObj.variables
      }
      this.options.branches.push(opt)
    }
  }

  #buildVariablesObject(variables) {
    if (!variables) {
      return undefined
    }
    const obj = { variables: [] }
    for (const variable of variables.values()) {
      obj.variables.push({ variable: `${variable}`, value: '' })
    }
    return obj.variables.length > 0 ? obj : undefined
  }
}

export default DataflowOptions
