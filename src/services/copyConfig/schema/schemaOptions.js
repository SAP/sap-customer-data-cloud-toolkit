import Options from '../options'

class SchemaOptions extends Options {
  #schema

  constructor(schema) {
    super({
      id: 'schema',
      name: 'schema',
      value: true,
      branches: [
        {
          id: 'dataSchema',
          name: 'dataSchema',
          value: true,
        },
        {
          id: 'profileSchema',
          name: 'profileSchema',
          value: true,
        },
      ],
    })
    this.#schema = schema
  }

  getConfiguration() {
    return this.#schema
  }
}

export default SchemaOptions
