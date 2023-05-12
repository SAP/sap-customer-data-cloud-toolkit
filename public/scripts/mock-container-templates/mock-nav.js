/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

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
