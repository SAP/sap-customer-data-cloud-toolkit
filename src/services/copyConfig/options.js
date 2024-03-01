/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

class Options {
  constructor(options) {
    this.options = options
  }

  getOptions() {
    return this.options
  }

  getOptionsDisabled() {
    const opt = JSON.parse(JSON.stringify(this.options))
    opt.value = false
    this.#setOptionsValue(opt, false)
    return opt
  }

  #setOptionsValue(option, value) {
    if (option.branches) {
      for (const o of option.branches) {
        o.value = value
        if (o.branches) {
          this.#setOptionsValue(o, value)
        }
      }
    }
  }

  enableAllOptions() {
    this.options.value = true
    this.#setOptionsValue(this.options, true)
  }

  setOptions(options) {
    this.options = options
  }

  setOption(name, value) {
    if (this.getOptions().branches) {
      for (const option of this.getOptions().branches) {
        if (option.name === name) {
          option.value = value
          break
        }
      }
    } else {
      if (this.getOptions().name === name) {
        this.getOptions().value = value
      }
    }
  }

  removeInfo(name, info) {
    return info.branches.filter(this.#remove(name))
  }
  removeLink(name, info) {
    info.branches.filter((obj) => obj.name === 'Include Links')
  }
  #remove(name) {
    return function (value, index, array) {
      if (value.name === name) {
        array.splice(index, 1)
        return true
      }
      return false
    }
  }

  getId() {
    return this.options.id
  }
  addBranch(name) {
    const collection = this.options.branches.find((collection) => collection.name === name)
    const optionName = `Include ${name} URL`
    if (collection) {
      collection.branches = []
      collection.branches.push({
        id: `${name}-Link`,
        name: optionName,
        formatName: false,
        value: false,
      })
    }
  }

  getOptionValue(optionName) {
    if (this.getOptions().name === optionName) {
      return this.getOptions().value
    }
    if (this.getOptions().branches) {
      for (const option of this.getOptions().branches) {
        if (option.name === optionName) {
          return option.value
        }
      }
    }
    return false
  }
}

export default Options
