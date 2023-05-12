/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { onElementExists } from '../../inject/utils'

export const cleanTreeVerticalScrolls = () => {
  onElementExists('ui5-tree', () => {
    document
      .querySelectorAll('ui5-tree')
      .forEach((element) => element.shadowRoot.querySelector('ui5-tree-list').shadowRoot.querySelectorAll('div')[1].classList.remove('ui5-list-scroll-container'))
  })
}

export const areConfigurationsFilled = (configurations) => {
  if (!configurations) {
    return false
  }

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
