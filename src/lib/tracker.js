import Web from '@sap_oss/automated-usage-tracking-tool'

const trackingTool = new Web({
  apiKey: '4_TCuGT23_GS-FxSIFf3YNdQ',
  dataCenter: 'eu1',
})

export async function requestConsentConfirmation() {
  return await trackingTool.requestConsentConfirmation({
    message: `
      <h2>SAP Customer Data Cloud toolkit</h2>
      This app collects anonymous usage data to help deliver and improve this product. By installing this app, you agree to share this information with SAP. If you wish to revoke your consent, please uninstall the app. Do you want to continue?
    `,
  })
}

export async function requestConsentQuestion() {
  return await trackingTool.requestConsentQuestion({
    message: `
      <h2>SAP Customer Data Cloud toolkit</h2>
      This app collects anonymous usage data to help deliver and improve this product. By installing this app, you agree to share this information with SAP. If you wish to revoke your consent, please uninstall the app. Do you want to continue?
    `,
  })
}

export async function trackUsage({ featureName }) {
  return await trackingTool.trackUsage({
    toolName: 'sap-customer-data-cloud-toolkit',
    featureName,
  })
}
