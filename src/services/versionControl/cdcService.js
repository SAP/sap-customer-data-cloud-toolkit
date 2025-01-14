import { getCommitFiles } from './githubUtils'
import {
  setPolicies,
  setWebSDK,
  setSMS,
  setExtension,
  setSchema,
  setScreenSets,
  setRBA,
  setEmailTemplates,
  setCommunicationTopics,
  setDataflow,
  setWebhook,
  setConsent,
  setSocial,
  setRecaptcha,
} from './setters'

class CdcService {
  constructor(versionControl) {
    this.versionControl = versionControl
  }

  getCdcData = () => {
    const responses = [
      { name: 'webSdk', promise: this.versionControl.webSdk.get() },
      { name: 'dataflow', promise: this.versionControl.dataflow.search() },
      { name: 'emails', promise: this.versionControl.emails.get() },
      { name: 'extension', promise: this.versionControl.extension.get() },
      { name: 'policies', promise: this.versionControl.policies.get() },
      { name: 'rba', promise: this.versionControl.rba.get() },
      { name: 'riskAssessment', promise: this.versionControl.riskAssessment.get() },
      { name: 'schema', promise: this.versionControl.schema.get() },
      { name: 'screenSets', promise: this.versionControl.screenSets.get() },
      { name: 'sms', promise: this.versionControl.sms.get() },
      { name: 'channel', promise: this.versionControl.communication.get() },
      { name: 'topic', promise: this.versionControl.topic.searchTopics() },
      { name: 'webhook', promise: this.versionControl.webhook.get() },
      { name: 'consent', promise: this.versionControl.consent.get() },
      { name: 'social', promise: this.versionControl.social.get() },
      { name: 'recaptcha', promise: this.versionControl.recaptcha.get() },
    ]
    return responses
  }

  fetchCDCConfigs = async () => {
    const cdcDataArray = this.getCdcData()
    if (!Array.isArray(cdcDataArray)) {
      throw new Error('getCdcData must return an array')
    }
    const cdcData = await Promise.all(
      cdcDataArray.map(async ({ name, promise }) => {
        const data = await promise.catch((err) => console.error(`Error resolving ${name}:`, err))
        return { [name]: data }
      }),
    )
    return Object.assign({}, ...cdcData)
  }

  applyCommitConfig = async (commitSha) => {
    const files = await getCommitFiles(this.versionControl, commitSha)
    for (const file of files) {
      // Strip the 'src/versionControl/' prefix and '.json' suffix, match file type correctly
      // const fileType = file.filename.replace('src/versionControl/', '').replace(/\.json$/, '')
      const fileType = file.filename.split('/').pop().split('.').shift()

      let filteredResponse = file.content
      switch (fileType) {
        case 'webSdk':
          await setWebSDK.call(this.versionControl, filteredResponse)
          break
        case 'emails':
          await setEmailTemplates.call(this.versionControl, filteredResponse)
          break
        case 'extension':
          await setExtension.call(this.versionControl, filteredResponse)
          break
        case 'policies':
          await setPolicies.call(this.versionControl, filteredResponse)
          break
        case 'rba':
          await setRBA.call(this.versionControl, filteredResponse)
          break
        case 'schema':
          await setSchema.call(this.versionControl, filteredResponse)
          break
        case 'screenSets':
          await setScreenSets.call(this.versionControl, filteredResponse)
          break
        case 'sms':
          await setSMS.call(this.versionControl, filteredResponse)
          break
        case 'channel':
          await setCommunicationTopics.call(this.versionControl, filteredResponse)
          break
        case 'topic':
          await setCommunicationTopics.call(this.versionControl, filteredResponse)
          break
        case 'dataflow':
          await setDataflow.call(this.versionControl, filteredResponse)
          break
        case 'webhook':
          await setWebhook.call(this.versionControl, filteredResponse)
          break
        case 'consent':
          await setConsent.call(this.versionControl, filteredResponse)
          break
        case 'social':
          await setSocial.call(this.versionControl, filteredResponse)
          break
        case 'recaptcha':
          await setRecaptcha.call(this.versionControl, filteredResponse)
          break
        default:
          console.warn(`Unknown file type: ${fileType}`)
      }
    }
  }
}

export default CdcService
