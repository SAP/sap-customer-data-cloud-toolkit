import Options from "../options";

class SchemaOptions extends Options{
    #schema

    constructor(schema) {
        super([
            { id: 'dataSchema', value: true },
            { id: 'profileSchema', value: true },
        ])
        this.#schema = schema
    }

    getConfiguration() { return this.#schema }
}

export default SchemaOptions
