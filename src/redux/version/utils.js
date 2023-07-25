/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


export const fillState = (state, versionData) => {
  state.isNewReleaseAvailable = versionData.isNewReleaseAvailable
  state.latestReleaseVersion = versionData.latestReleaseVersion
  state.latestReleaseUrl = versionData.latestReleaseUrl
}

export const clearState = (state) => {
  state.isNewReleaseAvailable = false
  state.latestReleaseVersion = ''
  state.latestReleaseUrl = ''
}
