import Topic from '../../copyConfig/communication/topic'
import { extractAndTransformCommunicationFields } from './transformCommunicationFields'

class TopicImportFields {
  #credentials
  #site
  #dataCenter
  #topic
  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#topic = new Topic(credentials, site, dataCenter)
  }
  async exportTopicData() {
    const topicResponse = await this.getTopic()
    if (topicResponse.errorCode === 0) {
      return this.getTopicsData(topicResponse)
    }
  }
  async exportTransformedCommunicationData() {
    const result = []
    const cleanCommunicationResponse = await this.exportTopicData()
    result.push(...extractAndTransformCommunicationFields(cleanCommunicationResponse))

    return result
  }
  async getTopic() {
    return this.#topic.searchTopics()
  }
  getTopicsData(topicsResponse) {
    const communications = {}
    topicsResponse.results.forEach((obj, index) => {
      communications[index] = obj
    })
    return { communications }
  }
}
export default TopicImportFields
