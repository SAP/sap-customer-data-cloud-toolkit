/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { expectedSchemaResponse } from '../schema/dataTest.js'
import SchemaOptions from '../schema/schemaOptions.js'
import PolicyOptions from '../policies/policyOptions.js'
import RbaOptions from '../rba/rbaOptions.js'
import EmailOptions from '../emails/emailOptions.js'
import { getPolicyConfig } from '../policies/dataTest.js'
import { getEmailsExpectedResponse } from '../../emails/dataTest.js'

export function getInfoExpectedResponse(supports) {
  const schemaOptions = new SchemaOptions(undefined)
  const schema = supports ? schemaOptions.getOptions() : schemaOptions.getOptionsDisabled()

  const SCREEN_SET_COLLECTION_DEFAULT = 'Default'
  const screenSets = createScreenSetCollection(SCREEN_SET_COLLECTION_DEFAULT, supports)

  const policiesOptions = new PolicyOptions(undefined)
  policiesOptions.addSupportedPolicies(getPolicyConfig)
  const policies = supports ? policiesOptions.getOptions() : policiesOptions.getOptionsDisabled()

  const socialIdentities = {
    id: 'socialIdentities',
    name: 'socialIdentities',
    value: supports,
    link: '-',
  }

  const emailOptions = new EmailOptions(undefined)
  emailOptions.addEmails(getEmailsExpectedResponse)
  const emailTemplates = supports ? emailOptions.getOptions() : emailOptions.getOptionsDisabled()

  const smsTemplates = {
    id: 'smsTemplates',
    name: 'SMS Templates',
    formatName: false,
    value: supports,
  }

  const webSdk = {
    id: 'webSdk',
    name: 'webSdk',
    value: supports,
  }

  const consent = {
    id: 'consent',
    name: 'consentStatements',
    value: supports,
  }

  const communicationTopics = {
    id: 'communicationTopics',
    name: 'communicationTopics',
    value: supports,
  }

  const dataflows = {
    id: 'dataflows',
    name: 'dataflows',
    value: supports,
    formatName: true,
    branches: [
      {
        id: 'dataflow1',
        name: 'dataflow1',
        value: supports,
        formatName: false,
      },
      {
        id: 'dataflow2',
        name: 'dataflow2',
        value: supports,
        formatName: false,
        variables: [
          { variable: '{{hostname}}', value: '' },
          { variable: '{{username}}', value: '' },
          { variable: '{{mobile}}', value: '' },
          { variable: '{{phoneNumber}}', value: '' },
          { variable: '{{userKey}}', value: '' },
          { variable: '{{accounts}}', value: '' },
          { variable: '{{wrapField}}', value: '' },
          { variable: '{{injectValue}}', value: '' },
        ],
      },
    ],
  }

  const webhooks = {
    id: 'Webhooks',
    name: 'Webhooks',
    value: supports,
    formatName: false,
    branches: [
      {
        id: 'webhook1',
        name: 'webhook1',
        value: supports,
        formatName: false,
      },
      {
        id: 'webhook2',
        name: 'webhook2',
        value: supports,
        formatName: false,
      },
    ],
  }

  const extensions = {
    id: 'Extensions',
    name: 'Extensions',
    value: supports,
    formatName: false,
    branches: [
      {
        id: 'OnBeforeAccountsRegister',
        name: 'OnBeforeAccountsRegister',
        value: supports,
        formatName: false,
      },
      {
        id: 'OnBeforeAccountsLogin',
        name: 'OnBeforeAccountsLogin',
        value: supports,
        formatName: false,
      },
    ],
  }
  const recaptcha = {
    formatName: false,
    id: 'recaptchaPolicies',
    name: 'CAPTCHA Policies',
    value: supports,
    link: '-',
  }

  const rbaOptions = new RbaOptions(undefined)
  const rba = supports ? rbaOptions.getOptions() : rbaOptions.getOptionsDisabled()

  return [schema, consent, communicationTopics, screenSets, policies, socialIdentities, emailTemplates, smsTemplates, webSdk, dataflows, webhooks, extensions, rba, recaptcha]
}

export function getExpectedSchemaResponseExcept(exceptions) {
  const response = JSON.parse(JSON.stringify(expectedSchemaResponse))
  exceptions.forEach((exception) => {
    delete response[exception]
  })
  return response
}

function createScreenSet(collection, name, value) {
  return {
    id: `${collection}-${name}`,
    name: `${collection}-${name}`,
    formatName: false,
    value: value,
  }
}

function createScreenSetCollection(collection, value) {
  const screenSets = {
    id: 'screenSets',
    name: 'Screen-Sets',
    value: value,
    formatName: false,
    branches: [
      {
        id: collection,
        name: collection,
        value: value,
        formatName: false,
        branches: [],
      },
    ],
  }
  const screenSetIds = [
    'LinkAccounts',
    'LiteRegistration',
    'OrganizationRegistration',
    'PasswordlessLogin',
    'ProfileUpdate',
    'ReAuthentication',
    'RegistrationLogin',
    'Subscriptions',
  ]

  for (const name of screenSetIds) {
    screenSets.branches[0].branches.push(createScreenSet(collection, name, value))
  }
  return screenSets
}
