/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import Options from '../copyConfig/options'

export const createOptions = (items) => {
  if (!Array.isArray(items)) {
    if (typeof items === 'object' && items !== null) {
      items = Object.values(items)
    } else {
      throw new TypeError(`Expected an array or object for items, but got ${typeof items}`)
    }
  }

  const optionsData = {
    branches: items.map((item) => ({
      name: item.name,
      value: true,
    })),
  }

  return new Options(optionsData)
}

export const extractConsentIdsAndLanguages = (preferences) => {
  const idsAndLanguages = []
  for (const consentId of Object.keys(preferences)) {
    const consent = preferences[consentId]
    if (consent.langs) {
      for (const language of consent.langs) {
        idsAndLanguages.push({ consentId, language })
      }
    }
  }
  return idsAndLanguages
}