import trackingTool from '@sap_oss/automated-usage-tracking-tool'

export function initTracker() {
  trackingTool.init({
    apiKey: '4_TCuGT23_GS-FxSIFf3YNdQ',
    dataCenter: 'eu1',
    storageName: 'usageTracking',
  })
}

export async function requestConsentConfirmation() {
  initTracker()
  return await trackingTool.requestConsentConfirmation()
}

export async function trackUsage({ featureName }) {
  initTracker()
  return await trackingTool.trackUsage({
    toolName: 'sap-customer-data-cloud-toolkit',
    featureName,
  })
}
