/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { onElementExists } from '../../inject/utils'
import { ERROR_SEVERITY_ERROR } from '../../services/errors/generateErrorResponse'
import { Tracker } from '../../tracker/tracker'

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

export const errorsAreWarnings = (errors) => {
  return !errors.some((error) => !error.hasOwnProperty('severity') || error.severity === ERROR_SEVERITY_ERROR)
}

export const sendReportOnWarnings = (errors) => {
  const SEND_REPORT_DELAY_IN_MILLIS = 2000
  if (errors.length && errorsAreWarnings(errors)) {
    setTimeout(() => {
      Tracker.reportUsage()
    }, SEND_REPORT_DELAY_IN_MILLIS)
  }
}

export const handleCheckboxChange = (dispatch, checkbox, value, siteId, setConfigurationStatus) => {
  const checkBoxId = checkbox.id
  if (checkbox.link) {
    dispatch(setConfigurationStatus({ siteId: siteId, checkBoxId, value: value }))
  }
}

export const processNestedBranches = (dispatch, branches, value, siteId, setConfigurationStatus) => {
  branches.forEach((branch) => {
    handleCheckboxChange(dispatch, branch, value, siteId, setConfigurationStatus)

    if (branch.branches && branch.branches.length > 0) {
      branch.branches.forEach((nestedBranch) => handleCheckboxChange(dispatch, nestedBranch, value, siteId, setConfigurationStatus))
    }
  })
}

export const onSelectAllIncludeUrlChangeHandler = (dispatch, configurations, siteId, setConfigurationStatus) => {
  configurations.forEach((configuration) => {
    if (configuration.branches && configuration.branches.length > 0) {
      processNestedBranches(dispatch, configuration.branches, false, siteId, setConfigurationStatus)
    }
    if (configuration.link) {
      handleCheckboxChange(dispatch, configuration, false, siteId, setConfigurationStatus)
    }
  })
}

export const onSelectAllCheckboxChange =
  (siteId = null, setSelectAllCheckboxState, configurations, dispatch, setConfigurationStatus) =>
  (event) => {
    const value = event.srcElement.checked
    setSelectAllCheckboxState(value)
    configurations.forEach((configuration) => {
      const checkBoxId = configuration.id
      const details = siteId ? { siteId: siteId, checkBoxId, value } : { checkBoxId, value }
      dispatch(setConfigurationStatus(details))
    })
  }
