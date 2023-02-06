import { onElementExists } from '../../inject/utils'

export const cleanTreeVerticalScrolls = () => {
  onElementExists('ui5-tree', () => {
    document
      .querySelectorAll('ui5-tree')
      .forEach((element) => element.shadowRoot.querySelector('ui5-tree-list').shadowRoot.querySelectorAll('div')[1].classList.remove('ui5-list-scroll-container'))
  })
}

export const areConfigurationsFilled = (configurations) => {
  for (const configuration of configurations) {
    if (configuration.value === true) {
      return true
    }
    if (configuration.branches) {
      const foundConfiguration = areConfigurationsFilled(configuration.branches)
      if (foundConfiguration) {
        return true
      }
    }
  }
  return false
}
