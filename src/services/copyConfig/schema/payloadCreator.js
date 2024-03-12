export default class PayloadCreator {
  static createPayloadWithRequiredOnly(payload, schemaName) {
    const clonePayload = JSON.parse(JSON.stringify(payload))
    for (const field of Object.keys(clonePayload[schemaName].fields)) {
      this.#processObject(field, clonePayload[schemaName].fields)
    }
    return clonePayload
  }

  static #processObject(key, root) {
    const keys = Object.keys(root[key])
    if (keys.includes('required')) {
      root[key] = { required: root[key].required }
    } else {
      const entries = Object.entries(root[key])
      entries.forEach((entry) => {
        if (!this.#isPrimitiveType(entry[1])) {
          return this.#processObject(entry[0], root[key])
        }
      })
    }
    return root
  }

  static #isPrimitiveType(value) {
    if (value === null) {
      return true
    }
    if (typeof value == 'object' || typeof value == 'function') {
      return false
    } else {
      return true
    }
  }
}
