/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { expectedSchemaResponse } from '../schema/dataTest'
import SchemaOptions from '../schema/schemaOptions'
import PolicyOptions from '../policies/policyOptions'
import EmailTemplateNameTranslator from '../../emails/emailTemplateNameTranslator'

export function getInfoExpectedResponse(supports) {
  const schemaOptions = new SchemaOptions(undefined)
  const schema = supports ? schemaOptions.getOptions() : schemaOptions.getOptionsDisabled()

  const SCREEN_SET_COLLECTION_DEFAULT = 'Default'
  const screenSets = createScreenSetCollection(SCREEN_SET_COLLECTION_DEFAULT, supports)

  const policiesOptions = new PolicyOptions(undefined)
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
    branches: [
      {
        id: 'dataflow1',
        name: 'dataflow1',
        value: supports,
        variables: [{ variable: 'variabletest1', value: '' }],
      },
      {
        id: 'dataflow2',
        name: 'dataflow2',
        value: supports,
        variables: [
          { variable: 'variabletest2', value: '' },
          { variable: 'variabletest3', value: '' },
        ],
      },
      {
        id: 'dataflow3',
        name: 'dataflow3',
        value: supports,
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

  return [schema, consent, communicationTopics, screenSets, policies, socialIdentities, emailTemplates, smsTemplates, webSdk, dataflows, webhooks, extensions]
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

function createEmailTemplates(value) {
  const emailTemplates = {
    id: 'emailTemplates',
    name: 'emailTemplates',
    value: value,
    branches: [],
  }
  const emailTemplateNameTranslator = new EmailTemplateNameTranslator()
  for (const emailInternalName of emailTemplateNameTranslator.getInternalNames()) {
    emailTemplates.branches.push({
      id: emailInternalName,
      name: emailTemplateNameTranslator.translateInternalName(emailInternalName),
      value: value,
    })
  }
  return emailTemplates
}
