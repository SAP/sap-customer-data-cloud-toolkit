export const availableThemes = ['sap_horizon', 'sap_fiori_3']
export const cssThemeElementId = 'base-theme-styles'

export const getCurrentConsoleTheme = function () {
  const cssLinkElement = document.getElementById(cssThemeElementId)
  const currentTheme = availableThemes.find((theme) => cssLinkElement?.href.includes(theme))
  return currentTheme || availableThemes[0]
}
export const getCurrentParameters = function (url) {
  const urlParams = new URLSearchParams(url)
  console.log('urlParamas', urlParams)
}
