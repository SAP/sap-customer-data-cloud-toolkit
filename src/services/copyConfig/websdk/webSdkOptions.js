import Options from '../options'

class WebSdkOptions extends Options {
    #webSdk

    constructor(webSdk) {
        super([{ id: 'webSdk', value: true }])
        this.#webSdk = webSdk
    }

    getConfiguration() {
        return this.#webSdk
    }
}

export default WebSdkOptions