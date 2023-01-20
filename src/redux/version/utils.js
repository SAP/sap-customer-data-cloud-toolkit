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
