import { availableThemes, cssThemeElementId, getCurrentConsoleTheme } from './theme.js'

describe('getCurrentConsoleTheme', () => {
  beforeAll(() => {
    // Mock the DOM element
    const cssLinkElement = document.createElement('link')
    cssLinkElement.id = cssThemeElementId
    document.body.appendChild(cssLinkElement)
  })

  test('should return the current theme if it is available', () => {
    document.getElementById(cssThemeElementId).href = 'path/to/sap_horizon.css'
    expect(getCurrentConsoleTheme()).toBe('sap_horizon')
  })

  test('should return the first available theme if the current theme is not available', () => {
    document.getElementById(cssThemeElementId).href = 'path/to/unknown_theme.css'
    expect(getCurrentConsoleTheme()).toBe(availableThemes[0])
  })
})
