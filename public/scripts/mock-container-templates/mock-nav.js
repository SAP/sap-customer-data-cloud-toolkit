const MAIN_CONTAINER_CLASS = 'cdc-tools-app'
const ROUTE_CONTAINER_CLASS = 'cdc-tools-app-container'

// Inject all mock template containers in <mock-container-templates/> inside MAIN_CONTAINER_CLASS to be show by navigation
onElementExists(`.${ROUTE_CONTAINER_CLASS}`, () => {
  const appWrapper = querySelectorAllShadows(`.${MAIN_CONTAINER_CLASS}`)[0]
  const mockContainerTemplates = [...querySelectorAllShadows('mock-container-templates')[0].children]

  mockContainerTemplates.forEach((mockContainer) => {
    mockContainer.classList.add(ROUTE_CONTAINER_CLASS)
    appWrapper.prepend(mockContainer)
  })
})
