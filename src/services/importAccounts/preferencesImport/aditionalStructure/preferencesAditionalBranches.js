/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const addPreferencesBranches = (branches, parentId) => {
  const additionalBranches = [
    { id: `${parentId}.isConsentGranted`, name: 'isConsentGranted', value: false, branches: [] },
    { id: `${parentId}.actionTimestamp`, name: 'actionTimestamp', value: false, branches: [] },
    { id: `${parentId}.lastConsentModified`, name: 'lastConsentModified', value: false, branches: [] },
    { id: `${parentId}.docVersion`, name: 'docVersion', value: false, branches: [] },
    { id: `${parentId}.docDate`, name: 'docDate', value: false, branches: [] },
    { id: `${parentId}.tags`, name: 'tags', value: false, branches: [] },
    { id: `${parentId}.entitlements`, name: 'entitlements', value: false, branches: [] },
  ]

  branches.push(...additionalBranches)
}
