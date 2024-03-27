/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { expectedSchemaResponse } from '../schema/dataTest.js'
import SchemaOptions from '../schema/schemaOptions.js'
import PolicyOptions from '../policies/policyOptions.js'
import EmailTemplateNameTranslator from '../../emails/emailTemplateNameTranslator.js'
import RbaOptions from '../rba/rbaOptions.js'

export function getInfoExpectedResponse(supports) {
  const schemaOptions = new SchemaOptions(undefined)
  const schema = supports ? schemaOptions.getOptions() : schemaOptions.getOptionsDisabled()

  const SCREEN_SET_COLLECTION_DEFAULT = 'Default'
  const screenSets = createScreenSetCollection(SCREEN_SET_COLLECTION_DEFAULT, supports)

  const policiesOptions = new PolicyOptions(undefined)
  policiesOptions.addUrl()
  const policies = supports ? policiesOptions.getOptions() : policiesOptions.getOptionsDisabled()

  const socialIdentities = {
    id: 'socialIdentities',
    name: 'socialIdentities',
    value: supports,
  }

  const emailTemplates = createEmailTemplates(supports)

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
    branches: [
      {
        formatName: false,
        id: 'consentStatements-Link',
        name: 'Include Document URL',
        value: false,
      },
    ],
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

  const rbaOptions = new RbaOptions(undefined)
  const rba = supports ? rbaOptions.getOptions() : rbaOptions.getOptionsDisabled()

  return [schema, consent, communicationTopics, screenSets, policies, socialIdentities, emailTemplates, smsTemplates, webSdk, dataflows, webhooks, extensions, rba]
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
function addExtraBranch(emailInternalName, emailTemplates, emailTemplateNameTranslator, value) {
  const branchesMap = {
    passwordReset: {
      id: emailInternalName,
      name: emailTemplateNameTranslator.translateInternalName(emailInternalName),
      value: value,
      branches: [
        {
          formatName: false,
          id: `PasswordReset-Link`,
          name: 'Include Reset Page URL',
          value: false,
        },
      ],
    },
    preferencesCenter: {
      id: emailInternalName,
      name: emailTemplateNameTranslator.translateInternalName(emailInternalName),
      value: value,
      branches: [
        {
          formatName: false,
          id: `LitePreferencesCenter-Link`,
          name: 'Include Lite Preferences Center URL',
          value: false,
        },
      ],
    },
  }

  if (branchesMap.hasOwnProperty(emailInternalName)) {
    emailTemplates.branches.push(branchesMap[emailInternalName])
  }
}

function createEmailTemplates(value) {
  const emailTemplates = {
    id: 'emailTemplates',
    name: 'emailTemplates',
    value: value,
    branches: [],
  }
  const emailTemplateNameTranslator = new EmailTemplateNameTranslator()
  for (const emailInternalName of emailTemplateNameTranslator.getInternalNames()) {
    if (emailInternalName === 'passwordReset' || emailInternalName === 'preferencesCenter') {
      addExtraBranch(emailInternalName, emailTemplates, emailTemplateNameTranslator, value)
    } else {
      emailTemplates.branches.push({
        id: emailInternalName,
        name: emailTemplateNameTranslator.translateInternalName(emailInternalName),
        value: value,
      })
    }
  }
  return emailTemplates
}
