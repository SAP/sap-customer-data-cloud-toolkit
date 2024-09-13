/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const treeNodeExample = {
  id: 'testNode1',
  name: 'testNode1',
  value: false,
}

export const setRbaRulesOperation = jest.fn()

export const dispatch = jest.fn()

export const t = (key) => key

export const eventMerge = {
  detail: {
    selectedOption: {
      dataset: { id: 'merge' },
    },
  },
}

export const eventReplace = {
  detail: {
    selectedOption: {
      dataset: { id: 'replace' },
    },
  },
}

export const replaceValue = { operation: 'replace' }

export const mergeValue = { operation: 'merge' }
