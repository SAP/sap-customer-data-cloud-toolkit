class Options {
  constructor(options) {
    this.options = options
  }

  getOptions() {
    return this.options
  }

  setOptions(id, value) {
    for (const option of this.getOptions()) {
      if (option.id === id) {
        option.value = value
        break
      }
    }
  }
}

export default Options
