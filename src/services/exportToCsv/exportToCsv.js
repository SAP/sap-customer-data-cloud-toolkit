/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export function createCSVFile(resultKeys, accountOption) {
  const csvData = new Blob([resultKeys], { type: 'text/csv' })
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = `Export_${accountOption}_Account_Template.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
