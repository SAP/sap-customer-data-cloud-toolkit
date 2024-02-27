import RbaPolicy from './policy.js'
import Policies from '../policies/policies.js'
import { removeAllPropertiesFromObjectExceptSome, stringToJson } from '../objectHelper.js'
import RiskAssessment from './riskAssessment.js'
import {
  ERROR_CODE_CANNOT_CHANGE_RBA_ON_CHILD_SITE,
  ERROR_SEVERITY_WARNING
} from "../../errors/generateErrorResponse";

export default class Rba {
  static ACCOUNT_TAKEOVER_PROTECTION = 'accountTakeoverProtection'
  static UNKNOWN_LOCATION_NOTIFICATION = 'unknownLocationNotification'
  static UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID = 'rba.unknownLocationNotification'
  static RULES = 'rules'
  #credentials
  #site
  #dataCenter
  #rbaPolicy
  #policies
  #riskAssessment

  constructor(credentials, site, dataCenter) {
    this.#credentials = credentials
    this.#site = site
    this.#dataCenter = dataCenter
    this.#rbaPolicy = new RbaPolicy(credentials, site, dataCenter)
    this.#policies = new Policies(credentials, site, dataCenter)
    this.#riskAssessment = new RiskAssessment(credentials, site)
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let responses = []
    if(this.#isChildSite(destinationSiteConfiguration, destinationSite)) {
      return [{
        errorCode: ERROR_CODE_CANNOT_CHANGE_RBA_ON_CHILD_SITE,
        errorDetails: 'Cannot change RBA data on child site.',
        errorMessage: 'Cannot copy RBA data to the destination site',
        statusCode: 412,
        statusReason: 'Precondition Failed',
        time: Date.now(),
        severity: ERROR_SEVERITY_WARNING,
        context: { targetApiKey: destinationSite, id: 'rba.' },
      }]
    }
    responses = await this.get()
    if (responses.every((r) => r.errorCode === 0)) {
      responses = (await this.#copyRba(destinationSite, destinationSiteConfiguration, responses, options)).flat()
    }
    stringToJson(responses, 'context')
    return responses
  }

  #isChildSite(siteInfo, siteApiKey) {
    return siteInfo.siteGroupOwner !== undefined && siteInfo.siteGroupOwner !== siteApiKey
  }

  async #copyRba(destinationSite, destinationSiteConfiguration, payloads, options) {
    const promises = []
    if (options.getOptionValue(Rba.ACCOUNT_TAKEOVER_PROTECTION)) {
      promises.push(this.setAccountTakeoverProtection(destinationSite, payloads[0]))
    }
    if (options.getOptionValue(Rba.UNKNOWN_LOCATION_NOTIFICATION)) {
      promises.push(this.setUnknownLocationNotification(destinationSite, destinationSiteConfiguration, payloads[1]))
    }
    if (options.getOptionValue(Rba.RULES)) {
      promises.push(this.setRbaRulesAndSettings(destinationSite, destinationSiteConfiguration, payloads[2]))
    }
    return await Promise.all(promises)
  }

  setAccountTakeoverProtection(destinationSite, response) {
    const payload = { Enabled: response.Enabled }
    return this.#riskAssessment.set(destinationSite, payload)
  }

  async setUnknownLocationNotification(destinationSite, destinationSiteConfiguration, payload) {
    const propertyName = 'security'
    const clonePayload = JSON.parse(JSON.stringify(payload))
    let securityPayload = removeAllPropertiesFromObjectExceptSome(clonePayload, [propertyName])
    removeAllPropertiesFromObjectExceptSome(securityPayload.security, ['sendUnknownLocationNotification'])
    const response = await this.#policies.set(destinationSite, securityPayload, destinationSiteConfiguration.dataCenter)
    response['context'] = response.context.replace(/&quot;/g, '"')
    response['context'] = response.context.replace(propertyName, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID)
    return response
  }

  async setRbaRulesAndSettings(destinationSite, destinationSiteConfiguration, payload) {
    const response = await this.#rbaPolicy.set(destinationSite, payload, destinationSiteConfiguration.dataCenter)
    response['context'] = response.context.replace(/&quot;/g, '"')
    return response
  }

  async get() {
    return await Promise.all([this.#riskAssessment.get(), this.#policies.get(), this.#rbaPolicy.get()])
  }

  static hasRules(response) {
    return response.policy.commonRules.length > 0 || response.policy.rulesSets.length > 1
  }
}
