const ROUTE_CONTAINER_CLASS = 'cdc-tools-app-container'

// Inject all containres in <mock-container-templates/> to be used by injected naviation
onElementExists(`.${ROUTE_CONTAINER_CLASS}`, () => {
  const appWrapper = querySelectorAllShadows('.cdc-tools-app')[0]
  const mockContainerTemplates = [...querySelectorAllShadows('mock-container-templates')[0].children]

  mockContainerTemplates.forEach((mockContainer) => {
    mockContainer.classList.add(ROUTE_CONTAINER_CLASS)
    appWrapper.appendChild(mockContainer)
  })
})
