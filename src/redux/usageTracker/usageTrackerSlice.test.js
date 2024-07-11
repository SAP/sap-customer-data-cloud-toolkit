import usageTrackerSliceReducer, { initializeTracker } from './usageTrackerSlice'
import trackingTool from '@sap_oss/automated-usage-tracking-tool'

describe('usage tracker test suite', () => {
  const initialState = {
    isTrackerInitialized: false,
    isConsentGranted: false,
  }

  test('should update state when initializeTracker is called', () => {
    const mockedTrackingToolInit = jest.spyOn(trackingTool, 'init').mockImplementation(() => {})
    const mockedTrackingToolIsConsentGranted = jest.spyOn(trackingTool, 'isConsentGranted').mockImplementation(() => true)

    const newState = usageTrackerSliceReducer(initialState, initializeTracker)
    expect(mockedTrackingToolInit).toHaveBeenCalled()
    expect(mockedTrackingToolIsConsentGranted).toHaveBeenCalled()
    expect(newState.isTrackerInitialized).toEqual(true)
    expect(newState.isConsentGranted).toEqual(true)
  })
})
