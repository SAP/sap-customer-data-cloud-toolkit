class ConfigOptions {
  #options

  constructor(options) {
    this.#options = options
  }

  shouldBeCopied(configuration) {
    let result = false
    if (configuration.getOptions().branches) {
      for (const option of configuration.getOptions().branches) {
        result |= this.#processOption(option, configuration)
      }
    } else {
      result |= this.#processOption(configuration.getOptions(), configuration)
    }
    return result
  }

  #processOption(option, configuration) {
    if (this.#isSupported(option.name)) {
      return true
    } else {
      configuration.setOption(option.name, false)
      return false
    }
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
    if (obj.name === name) {
      return obj.value
    }
    return obj.branches !== undefined ? this.#findRecursive(name, obj.branches, value) : value
  }
}

export default ConfigOptions
