/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const treeNodeExample = {
  id: 'testNode1',
  name: 'testNode1',
  value: false,
}

export const setRbaRulesMergeOrReplace = jest.fn()

export const dispatch = jest.fn()

export const t = (key) => key

export const eventMerge = {
  target: { text: 'CONFIGURATION_TREE.BUTTON_MERGE' },
}

export const eventReplace = {
  target: { text: 'CONFIGURATION_TREE.BUTTON_REPLACE' },
}

export const replaceValue = { mergeOrReplace: 'replace' }

export const mergeValue = { mergeOrReplace: 'merge' }
