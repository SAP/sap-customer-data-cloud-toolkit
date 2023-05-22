import Options from '../options'

class DataFlowOptions extends Options {
  #dataflow

  constructor(dataflow) {
    super({
      id: 'dataflow',
      name: 'dataflow',
      value: true,
    })
    this.#dataflow = dataflow
  }

  getConfiguration() {
    return this.#dataflow
  }

  removeDataflow(info) {
    info.branches = []
  }
}

export default DataFlowOptions
