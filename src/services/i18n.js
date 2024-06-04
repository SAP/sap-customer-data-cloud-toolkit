/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import i18n from 'i18next'

const DEFAULT_LANGUAGE = 'en'
const FALLBACK_LANGUAGE = 'en'

const initializeI18n = async () => {
  const resources = {
    [DEFAULT_LANGUAGE]: {
      translation: await import(`../locales/${DEFAULT_LANGUAGE}/translation.json`),
    },
  }

  i18n.init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  })
}

initializeI18n()

export const t = i18n.t

export default i18n
