/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const expectedPasswordObject = [
  {
    id: 'password',
    name: 'password',
    value: true,
    branches: [
      {
        id: 'password.compoundHashedPassword',
        name: 'compoundHashedPassword',
        value: true,
        branches: [],
      },
      {
        id: 'password.hashedPassword',
        name: 'hashedPassword',
        value: true,
        branches: [],
      },
      {
        id: 'password.hashSettings',
        name: 'hashSettings',
        value: true,
        branches: [
          {
            id: 'password.hashSettings.algorithm',
            name: 'algorithm',
            value: true,
            branches: [],
          },
          {
            id: 'password.hashSettings.salt',
            name: 'salt',
            value: true,
            branches: [],
          },
          {
            id: 'password.hashSettings.rounds',
            name: 'rounds',
            value: true,
            branches: [],
          },
          {
            id: 'password.hashSettings.format',
            name: 'format',
            value: true,
            branches: [],
          },
          {
            id: 'password.hashSettings.binaryFormat',
            name: 'binaryFormat',
            value: true,
            branches: [],
          },
          {
            id: 'password.hashSettings.URL',
            name: 'URL',
            value: true,
            branches: [],
          },
        ],
      },
      {
        id: 'password.secretQuestionAndAnswer',
        name: 'secretQuestionAndAnswer',
        value: true,
        branches: [
          {
            id: 'password.secretQuestionAndAnswer.secretQuestion',
            name: 'secretQuestion',
            value: true,
            branches: [],
          },
          {
            id: 'password.secretQuestionAndAnswer.secretAnswer',
            name: 'secretAnswer',
            value: true,
            branches: [],
          },
        ],
      },
    ],
  },
]

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
