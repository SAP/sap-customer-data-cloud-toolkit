import Options from '../options'

class CommunicationOptions extends Options {
  #communication

  constructor(communicationConfiguration) {
    super({
      id: 'communicationTopics',
      name: 'communicationTopics',
      value: true,
    })
    this.#communication = communicationConfiguration
  }

  getConfiguration() {
    return this.#communication
  }

  removeCommunication(info) {
    info.branches = []
  }
}

export default CommunicationOptions
