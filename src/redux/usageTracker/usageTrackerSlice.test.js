/**
 * @jest-environment jsdom
 */
import usageTrackerSliceReducer, { requestConsentConfirmation, trackUsage } from './usageTrackerSlice'
import * as utils from './utils'

describe('usage tracker test suite', () => {
  const initialState = {
    consentGranted: false,
  }

  test('should call setTrackUsageDialogStyles when requestConsentConfirmation is pending', () => {
    const action = requestConsentConfirmation.pending
    jest.spyOn(document, 'getElementById').mockReturnValue({})
    const mockedInitTracker = jest.spyOn(utils, 'initTracker').mockImplementation(() => {})
    const mockedSetTrackUsageDialogStyles = jest.spyOn(utils, 'setTrackUsageDialogStyles').mockImplementation(() => {})
    usageTrackerSliceReducer(initialState, action)
    expect(mockedInitTracker).toHaveBeenCalled()
    expect(mockedSetTrackUsageDialogStyles).toHaveBeenCalled()
  })

  test('should call setTrackUsageDialogStyles when requestConsentConfirmation is fulfilled', () => {
    const action = requestConsentConfirmation.fulfilled
    const newState = usageTrackerSliceReducer(initialState, action)
    expect(newState.consentGranted).toEqual(true)
  })
})
