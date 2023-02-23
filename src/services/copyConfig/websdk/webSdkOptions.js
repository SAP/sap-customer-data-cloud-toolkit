import Options from '../options'

class WebSdkOptions extends Options {
  #webSdk

  constructor(webSdk) {
    super({
      id: 'webSdk',
      name: 'webSdk',
      value: true,
    })
    this.#webSdk = webSdk
  }

  getConfiguration() {
    return this.#webSdk
  }

  removeWebSdk(info) {
    info.branches = []
  }
}

export default WebSdkOptions
