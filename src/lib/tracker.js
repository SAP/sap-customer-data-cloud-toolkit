import Web from '@sap_oss/automated-usage-tracking-tool'

const getCredentials = () => {
  const REACT_APP_TRACKER_API_KEY_PROD = '4_wjgLxoy9B1oRh3zpBulDhw'
  const REACT_APP_TRACKER_DATA_CENTER_PROD = 'eu1'
  const REACT_APP_TRACKER_API_KEY_DEV = process.env.REACT_APP_TRACKER_API_KEY_DEV
  const REACT_APP_TRACKER_DATA_CENTER_DEV = process.env.REACT_APP_TRACKER_DATA_CENTER_DEV

  // This variable is replaced to "false" on "beforeRelease.js" script
  const isDev = '{{REPLACED_IN_RELEASE}}'

  if (!isDev) {
    return { apiKey: REACT_APP_TRACKER_API_KEY_PROD, dataCenter: REACT_APP_TRACKER_DATA_CENTER_PROD }
  }

  if (!REACT_APP_TRACKER_API_KEY_DEV || !REACT_APP_TRACKER_DATA_CENTER_DEV) {
    return null
  }

  return { apiKey: REACT_APP_TRACKER_API_KEY_DEV, dataCenter: REACT_APP_TRACKER_DATA_CENTER_DEV }
}

export const initTracker = () => {
  const credentials = getCredentials()

  if (!credentials) {
    console.log('Tracking tool was not initialized due to missing API key or data center configuration.')
    return null
  }

  return new Web(credentials)
}

const trackingTool = initTracker()

function shouldSkipTracking() {
  return !trackingTool || window.Cypress
}

export async function requestConsentConfirmation() {
  if (shouldSkipTracking()) {
    return null
  }
  return await trackingTool.requestConsentConfirmation({
    message: `
    <h2>SAP Customer Data Cloud toolkit</h2>
    This app collects anonymous usage data to help deliver and improve this product. By installing this app, you agree to share this information with SAP. If you wish to revoke your consent, please uninstall the app. Do you want to continue?
  `,
  })
}

export async function trackUsage({ featureName }) {
  if (shouldSkipTracking()) {
    return null
  }
  return await trackingTool.trackUsage({
    toolName: 'Customer Data Cloud toolkit',
    featureName,
  })
}
