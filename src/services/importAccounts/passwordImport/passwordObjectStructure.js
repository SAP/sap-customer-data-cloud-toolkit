/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const passwordObjectStructure = () => {
  const passwordStructure = [
    {
      id: 'password',
      name: 'password',
      value: false,
      branches: [
        { id: 'password.compoundHashedPassword', name: 'compoundHashedPassword', value: false, branches: [] },
        { id: 'password.hashedPassword', name: 'hashedPassword', value: false, branches: [] },

        {
          id: 'password.hashSettings',
          name: 'hashSettings',
          value: false,
          branches: [
            { id: 'password.hashSettings.algorithm', name: 'algorithm', value: false, branches: [] },
            { id: 'password.hashSettings.salt', name: 'salt', value: false, branches: [] },
            { id: 'password.hashSettings.rounds', name: 'rounds', value: false, branches: [] },
            { id: 'password.hashSettings.format', name: 'format', value: false, branches: [] },
            { id: 'password.hashSettings.binaryFormat', name: 'binaryFormat', value: false, branches: [] },
            { id: 'password.hashSettings.URL', name: 'URL', value: false, branches: [] },
          ],
        },
        {
          id: 'password.secretQuestionAndAnswer',
          name: 'secretQuestionAndAnswer',
          value: false,
          branches: [
            { id: 'password.secretQuestionAndAnswer.secretQuestion', name: 'secretQuestion', value: false, branches: [] },
            { id: 'password.secretQuestionAndAnswer.secretAnswer', name: 'secretAnswer', value: false, branches: [] },
          ],
        },
      ],
    },
  ]
  return passwordStructure
}
