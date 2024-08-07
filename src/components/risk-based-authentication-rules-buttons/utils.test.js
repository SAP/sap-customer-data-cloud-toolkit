/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { handleRadioButtonChange } from './utils'
import { treeNodeExample, setRbaRulesOperation, dispatch, t, eventMerge, eventReplace, replaceValue, mergeValue } from './dataTest'

describe('handleRadioButtonChange function tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should dispatch merge action when merge button is clicked', () => {
    handleRadioButtonChange(eventMerge, treeNodeExample, setRbaRulesOperation, t, dispatch)
    expect(dispatch).toHaveBeenCalledWith(setRbaRulesOperation({ checkBoxId: treeNodeExample.id, mergeValue }))
  })

  test('should dispatch replace action when replace button is clicked', () => {
    handleRadioButtonChange(eventReplace, treeNodeExample, setRbaRulesOperation, t, dispatch)
    expect(dispatch).toHaveBeenCalledWith(setRbaRulesOperation({ checkBoxId: treeNodeExample.id, replaceValue }))
  })
})
