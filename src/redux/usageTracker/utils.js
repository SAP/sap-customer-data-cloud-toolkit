export const initTracker = (trackingTool) => {
  trackingTool.init({
    apiKey: '4_TCuGT23_GS-FxSIFf3YNdQ',
    dataCenter: 'eu1',
    storageName: 'usageTracking',
  })
}

export const setTrackUsageDialogStyles = (dialog) => {
  dialog.style.width = '500px'
  dialog.style.borderRadius = '5px'
  dialog.style.borderColor = '#fff'
  setTrackUsageDialogContentStyle(dialog)
  setTrackUsageDialogFooterStyle(dialog)
  setTrackUsageDialogConfirmButtonStyle(dialog)
}

function setTrackUsageDialogContentStyle(dialog) {
  // const dialogContent = document.getElementById('automated-usage-tracking-tool-dialog-content')
  const dialogContent = dialog.querySelector('#automated-usage-tracking-tool-dialog-content')
  dialogContent.style.padding = '8px'
  dialogContent.style.fontFamily = `"72override", "72", "72full", Arial, Helvetica, sans-serif`
  dialogContent.style.fontSize = '.875rem;'
}

function setTrackUsageDialogFooterStyle(dialog) {
  // const dialogFooter = document.getElementById('automated-usage-tracking-tool-dialog-footer')
  const dialogFooter = dialog.querySelector('#automated-usage-tracking-tool-dialog-footer')
  dialogFooter.style.display = 'inline-flex'
  dialogFooter.style.flexDirection = 'column'
  dialogFooter.style.width = '100%'
}

function setTrackUsageDialogConfirmButtonStyle(dialog) {
  // const confirmButton = document.getElementById('automated-usage-tracking-tool-dialog-confirm-button')
  const confirmButton = dialog.querySelector('#automated-usage-tracking-tool-dialog-confirm-button')
  confirmButton.style.color = '#fff'
  confirmButton.style.borderColor = '#0a6ed1'
  confirmButton.style.backgroundColor = '#0a6ed1'
  confirmButton.style.borderRadius = '.25rem'
  confirmButton.style.minWidth = '3.25rem'
  confirmButton.style.height = '2.25rem'
  confirmButton.style.fontFamily = `"72override", "72", "72full", Arial, Helvetica, sans-serif`
  confirmButton.style.fontSize = '14px'
  confirmButton.style.fontWeight = 700
  confirmButton.style.outline = 'auto'
  confirmButton.style.marginTop = '8px'
  confirmButton.style.alignSelf = 'end'
}
