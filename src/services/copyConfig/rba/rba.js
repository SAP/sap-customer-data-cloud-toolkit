import { ERROR_CODE_CANNOT_CHANGE_RBA_ON_CHILD_SITE, ERROR_SEVERITY_WARNING } from '../../errors/generateErrorResponse'
import { removeAllPropertiesFromObjectExceptSome, stringToJson } from '../objectHelper.js'
import Policies from '../policies/policies.js'
import RbaPolicy from './policy.js'
import RiskAssessment from './riskAssessment.js'

export default class Rba {
  static ACCOUNT_TAKEOVER_PROTECTION = 'accountTakeoverProtection'
  static UNKNOWN_LOCATION_NOTIFICATION = 'unknownLocationNotification'
  static UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID = 'rba.unknownLocationNotification'
  static RULES = 'RBA Rules'
  static OPERATION = {
    MERGE: 'merge',
    REPLACE: 'replace',
  }
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

    this.#rbaPolicy = new RbaPolicy(credentials, this.#site, this.#dataCenter)
    this.#policies = new Policies(credentials, this.#site, this.#dataCenter)
    this.#riskAssessment = new RiskAssessment(credentials, this.#site)
  }

  async copy(destinationSite, destinationSiteConfiguration, options) {
    let responses = []
    if (this.#isChildSite(destinationSiteConfiguration, destinationSite)) {
      return [
        {
          errorCode: ERROR_CODE_CANNOT_CHANGE_RBA_ON_CHILD_SITE,
          errorDetails: 'Cannot change RBA data on child site.',
          errorMessage: 'Cannot copy RBA data to the destination site',
          statusCode: 412,
          statusReason: 'Precondition Failed',
          time: Date.now(),
          severity: ERROR_SEVERITY_WARNING,
          context: { targetApiKey: destinationSite, id: 'rba.' },
        },
      ]
    }
    responses = await this.get()
    if (responses.every((r) => r.errorCode === 0)) {
      responses = (await this.#copyRba(destinationSite, destinationSiteConfiguration, responses, options)).flat()
    }
    if (responses) stringToJson(responses, 'context')
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
      const operation = options.getOptionOperation(Rba.RULES)
      promises.push(this.setRbaRulesAndSettings(destinationSite, destinationSiteConfiguration, payloads[2], operation))
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

    if (response.context) {
      response.context = response.context.replace(/&quot;/g, '"')
      response.context = response.context.replace(propertyName, Rba.UNKNOWN_LOCATION_NOTIFICATION_CONTEXT_ID)
    }

    return response
  }

  // Merge originCommonRules into destinationCommonRules by id
  mergeCommonRules(originCommonRules, destinationCommonRules) {
    const destinationCommonRulesMap = new Map(destinationCommonRules.map((rule) => [rule.id, rule]))

    originCommonRules.forEach((originRule) => {
      if (destinationCommonRulesMap.has(originRule.id)) {
        const destinationRuleIndex = destinationCommonRules.findIndex((r) => r.id === originRule.id)
        destinationCommonRules[destinationRuleIndex] = { ...destinationCommonRulesMap.get(originRule.id), ...originRule }
      } else {
        destinationCommonRules.push(originRule)
      }
    })

    return destinationCommonRules
  }
  // Merge originRuleSets into destinationRulesSets by id
  mergeRulesSets(originRulesSets, destinationRulesSets) {
    const destinationRulesSetsMap = new Map(destinationRulesSets.map((rule) => [rule.id, rule]))

    originRulesSets.forEach((originRule) => {
      if (destinationRulesSetsMap.has(originRule.id)) {
        const destinationRuleIndex = destinationRulesSets.findIndex((r) => r.id === originRule.id)
        destinationRulesSets[destinationRuleIndex] = { ...destinationRulesSetsMap.get(originRule.id), ...originRule }
      } else {
        destinationRulesSets.push(originRule)
      }
    })

    return destinationRulesSets
  }

  async setRbaRulesAndSettings(destinationApiKey, destinationSiteConfiguration, payload, operation = Rba.OPERATION.MERGE) {
    if (operation === Rba.OPERATION.MERGE) {
      const destinationSiteRbaPolicy = new RbaPolicy(this.#credentials, destinationApiKey, destinationSiteConfiguration.dataCenter)
      const destinationSitePolicies = await destinationSiteRbaPolicy.get()

      const originCommonRules = payload.policy.commonRules || []
      const originRulesSets = payload.policy.rulesSets || []
      const destinationCommonRules = destinationSitePolicies.policy && destinationSitePolicies.policy.commonRules ? destinationSitePolicies.policy.commonRules : []
      if (destinationSitePolicies.policy && destinationSitePolicies.policy.rulesSets) {
        const destinationRulesSets = destinationSitePolicies.policy.rulesSets
        payload.policy.rulesSets = this.mergeRulesSets(originRulesSets, destinationRulesSets)
      }
      payload.policy.commonRules = this.mergeCommonRules(originCommonRules, destinationCommonRules)
    }
    const response = await this.#rbaPolicy.set(destinationApiKey, payload, destinationSiteConfiguration.dataCenter)

    if (response.context) {
      response.context = response.context.replace(/&quot;/g, '"')
    }

    return response
  }

  get() {
    return Promise.all([this.#riskAssessment.get(), this.#policies.get(), this.#rbaPolicy.get()])
  }

  static hasRules(response) {
    return response.policy.commonRules.length > 0 || response.policy.rulesSets.length > 1
  }
}
