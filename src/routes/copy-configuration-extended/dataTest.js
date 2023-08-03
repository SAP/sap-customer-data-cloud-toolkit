/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { ERROR_SEVERITY_ERROR, ERROR_SEVERITY_WARNING } from '../../services/errors/generateErrorResponse'

export const targetSiteListItem = 'abcde - 111111 - Partner 1'

export const arrayWithError = [
  {
    severity: ERROR_SEVERITY_ERROR,
  },
  {
    severity: ERROR_SEVERITY_WARNING,
  },
]

export const arrayWithWarnings = [{ severity: ERROR_SEVERITY_WARNING }, { severity: ERROR_SEVERITY_WARNING }]
