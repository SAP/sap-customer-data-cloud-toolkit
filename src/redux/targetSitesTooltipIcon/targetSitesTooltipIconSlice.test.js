import targetSitesTooltipIconReducer, { setIsMouseOverIcon } from './targetSitesTooltipIconSlice'
import { initialState } from './dataTest'

describe('targetSitesTooltipIconSlice test suite', () => {
  test('should set isMouseOverIcon to true', () => {
    const newState = targetSitesTooltipIconReducer(initialState, setIsMouseOverIcon(true))
    expect(newState.isMouseOverIcon).toEqual(true)
  })
})
