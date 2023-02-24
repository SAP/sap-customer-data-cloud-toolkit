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
    this.#disableOptions(opt)
    return opt
  }

  #disableOptions(option) {
    if (option.branches) {
      for (const o of option.branches) {
        o.value = false
        if (o.branches) {
          this.#disableOptions(o)
        }
      }
    }
  }

  setOptions(name, value) {
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

  #remove(name) {
    return function (value, index, array) {
      if (value.name === name) {
        array.splice(index, 1)
        return true
      }
      return false
    }
  }
}

export default Options
