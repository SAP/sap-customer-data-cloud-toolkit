import Options from '../options'

class SocialOptions extends Options {
  #social

  constructor(social) {
    super([{ id: 'socialIdentities', value: true }])
    this.#social = social
  }

  getConfiguration() {
    return this.#social
  }
}

export default SocialOptions
