/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { createSimpleNode } from '../utils'

export const passwordObjectStructure = () => {
  const passwordStructure = [
    createSimpleNode('password', 'password', false, [
      createSimpleNode('password.compoundHashedPassword', 'compoundHashedPassword'),
      createSimpleNode('password.hashedPassword', 'hashedPassword'),
      createSimpleNode('password.hashSettings', 'hashSettings', false, [
        createSimpleNode('password.hashSettings.algorithm', 'algorithm'),
        createSimpleNode('password.hashSettings.salt', 'salt'),
        createSimpleNode('password.hashSettings.rounds', 'rounds'),
        createSimpleNode('password.hashSettings.format', 'format'),
        createSimpleNode('password.hashSettings.binaryFormat', 'binaryFormat'),
        createSimpleNode('password.hashSettings.URL', 'URL'),
      ]),
      createSimpleNode('password.secretQuestionAndAnswer', 'secretQuestionAndAnswer', false, [
        createSimpleNode('password.secretQuestionAndAnswer.secretQuestion', 'secretQuestion'),
        createSimpleNode('password.secretQuestionAndAnswer.secretAnswer', 'secretAnswer'),
      ]),
    ]),
  ]
  return passwordStructure
}
