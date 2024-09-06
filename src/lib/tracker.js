import Web from '@sap_oss/automated-usage-tracking-tool'

const API_KEY = process.env.REACT_APP_RELEASE_BUILD ? process.env.REACT_APP_TRACKER_API_KEY_PROD : process.env.REACT_APP_TRACKER_API_KEY_DEV
const DATA_CENTER = process.env.REACT_APP_RELEASE_BUILD ? process.env.REACT_APP_TRACKER_DATA_CENTER_PROD : process.env.REACT_APP_TRACKER_DATA_CENTER_DEV

let trackingTool = null

if (API_KEY && DATA_CENTER) {
  trackingTool = new Web({
    apiKey: API_KEY,
    dataCenter: DATA_CENTER,
  })
} else {
  console.log('Tracking tool was not initialized due to missing API key or data center configuration.')
}

export async function requestConsentConfirmation() {
  if (!trackingTool) {
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
  if (!trackingTool) {
    return null
  }
  return await trackingTool.trackUsage({
    toolName: 'Customer Data Cloud toolkit',
    featureName,
  })
}
