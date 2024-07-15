import trackingTool from '@sap_oss/automated-usage-tracking-tool'

export function initTracker() {
  trackingTool.init({
    apiKey: '4_TCuGT23_GS-FxSIFf3YNdQ',
    dataCenter: 'eu1',
  })
}

export async function requestConsentConfirmation() {
  initTracker()
  return await trackingTool.requestConsentConfirmation({
    message: `
      <h2>SAP Customer Data Cloud toolkit</h2>
      This app collects anonymous usage data to help deliver and improve this product. By installing this app, you agree to share this information with SAP. If you wish to revoke your consent, please uninstall the app. Do you want to continue?
    `,
  })
}

export async function trackUsage({ featureName }) {
  initTracker()
  return await trackingTool.trackUsage({
    toolName: 'sap-customer-data-cloud-toolkit',
    featureName,
  })
}
