/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
