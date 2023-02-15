class ConfigOptions {
  #options

  constructor(options) {
    this.#options = options
  }

  shouldBeCopied(configuration) {
    let result = false
    for (const option of configuration.getOptions()) {
      if (this.#isSupported(option.id)) {
        result = true
      } else {
        configuration.setOptions(option.id, false)
      }
    }
    return result
  }

  #isSupported(name) {
    return this.#findRecursive(name, this.#options, false)
  }

  #findRecursive(name, objArray, value) {
    for (const obj of objArray) {
      if (this.#find(name, obj, value)) {
        return true
      }
    }
    return value
  }

  #find(name, obj, value) {
    if (obj === undefined || value) {
      return value
    }
    if (obj.id === name) {
      return obj.value
    }
    return obj.branches !== undefined ? this.#findRecursive(name, obj.branches, value) : value
  }
}

export default ConfigOptions
