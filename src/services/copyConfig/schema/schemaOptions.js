import Options from '../options'

class SchemaOptions extends Options {
  static DATA_SCHEMA = 'dataSchema'
  static PROFILE_SCHEMA = 'profileSchema'
  #schema

  constructor(schema) {
    super({
      id: 'schema',
      name: 'schema',
      value: true,
      branches: [
        {
          id: SchemaOptions.DATA_SCHEMA,
          name: SchemaOptions.DATA_SCHEMA,
          value: true,
        },
        {
          id: SchemaOptions.PROFILE_SCHEMA,
          name: SchemaOptions.PROFILE_SCHEMA,
          value: true,
        },
      ],
    })
    this.#schema = schema
  }

  getConfiguration() {
    return this.#schema
  }

  removeDataSchema(info) {
    return this.removeInfo(SchemaOptions.DATA_SCHEMA, info)
  }

  removeProfileSchema(info) {
    return this.removeInfo(SchemaOptions.PROFILE_SCHEMA, info)
  }
}

export default SchemaOptions
