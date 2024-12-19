export function createCSVFile(resultKeys, accountOption) {
  const csvData = new Blob([resultKeys], { type: 'text/csv' })
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = `import${accountOption}Account.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
