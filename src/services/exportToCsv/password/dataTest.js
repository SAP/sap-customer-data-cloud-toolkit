/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { passwordBranches } from '../../importAccounts/mainDataSet'

export const expectedPasswordObject = { id: 'password', name: 'password', value: false, branches: passwordBranches }

export const expectedPasswordResponse = [
  'password.compoundHashedPassword',
  'password.hashedPassword',
  'password.hashSettings.algorithm',
  'password.hashSettings.salt',
  'password.hashSettings.rounds',
  'password.hashSettings.format',
  'password.hashSettings.binaryFormat',
  'password.hashSettings.URL',
  'password.secretQuestionAndAnswer.secretQuestion',
  'password.secretQuestionAndAnswer.secretAnswer',
]
