import { initTracker, requestConsentConfirmation } from './tracker'
import Web from '@sap_oss/automated-usage-tracking-tool'

process.env.REACT_APP_TRACKER_API_KEY_DEV = 'dev-key'
process.env.REACT_APP_TRACKER_DATA_CENTER_DEV = 'dev-center'
process.env.REACT_APP_TRACKER_API_KEY_PROD = 'prod-key'
process.env.REACT_APP_TRACKER_DATA_CENTER_PROD = 'prod-center'
global.window = {
  Cypress: false, // initialize as false for tests
}

describe('copyConfigurationExtendedSlice test suite', () => {
  beforeEach(() => {
    jest.resetModules() // Clears any cached modules.
  })
  it('should initialize the tracker with development credentials', () => {
    jest.mock('@sap_oss/automated-usage-tracking-tool', () => {
      return jest.fn().mockImplementation(() => {
        return {
          apiKey: 'dev-api-key',
          dataCenter: 'us1',
        }
      })
    })
    const tracker = initTracker()
    expect(Web).toHaveBeenCalledWith({ apiKey: 'dev-api-key', dataCenter: 'dev-data-center' })
    expect(tracker).not.toBeNull()
  })
  it('should initialize the tracker with requestConsentConfirmation', async () => {
    const tracker = initTracker()

    expect(tracker).not.toBeNull()
    expect(tracker.constructor).toBe(Web)
    expect(tracker.tracker.apiKey).toBe('dev-key')
    expect(tracker.tracker.dataCenter).toBe('dev-center')
  })
})
