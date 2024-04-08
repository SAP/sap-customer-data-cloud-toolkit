import { useEffect } from 'react'
import { cssThemeElementId } from '../utils/theme'

export const useThemeChange = (callback) => {
  useEffect(() => {
    const delayedCallback = () => setTimeout(callback, 250)

    const cssThemeElement = document.getElementById(cssThemeElementId)
    if (cssThemeElement) {
      const observer = new MutationObserver(delayedCallback)
      observer.observe(cssThemeElement, {
        attributes: true,
        attributeFilter: ['href'],
        subtree: true,
      })
      return () => observer.disconnect()
    }
  }, [callback])

  callback()
}
