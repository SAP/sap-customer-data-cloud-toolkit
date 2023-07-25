/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


const initialState = {
  isNewReleaseAvailable: false,
  latestReleaseUrl: '',
  latestReleaseVersion: '',
}

const versionData = {
  isNewReleaseAvailable: true,
  latestReleaseUrl: 'dummy test url',
  latestReleaseVersion: '6.0.0',
}

export { initialState, versionData }
