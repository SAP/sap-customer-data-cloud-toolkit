/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSimpleNode } from '../utils'

export const passwordObjectStructure = () => {
  const passwordStructure = [
    createSimpleNode('password', null, false, [
      createSimpleNode('password.compoundHashedPassword'),
      createSimpleNode('password.hashedPassword'),
      createSimpleNode('password.hashSettings', null, false, [
        createSimpleNode('password.hashSettings.algorithm'),
        createSimpleNode('password.hashSettings.salt'),
        createSimpleNode('password.hashSettings.rounds'),
        createSimpleNode('password.hashSettings.format'),
        createSimpleNode('password.hashSettings.binaryFormat'),
        createSimpleNode('password.hashSettings.URL'),
      ]),
      createSimpleNode('password.secretQuestionAndAnswer', null, false, [
        createSimpleNode('password.secretQuestionAndAnswer.secretQuestion'),
        createSimpleNode('password.secretQuestionAndAnswer.secretAnswer'),
      ]),
    ]),
  ]
  return passwordStructure
}
