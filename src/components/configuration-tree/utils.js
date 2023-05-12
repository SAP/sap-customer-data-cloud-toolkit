/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { ERROR_SEVERITY_ERROR } from '../../services/errors/generateErrorResponse'

const severityToInteger = { Error: 2, Warning: 1, Information: 0 }

export const getHighestSeverity = (errors) => {
  if (Array.isArray(errors)) {
    if (severityExists(errors)) {
      const severity = updateHighestSeverity(errors)
      return getSeverityString(severity)
    }
  } else {
    if (errors.severity) {
      return errors.severity
    }
  }
  return ERROR_SEVERITY_ERROR
}

const severityExists = (errors) => {
  return errors.filter((error) => errorHasSeverity(error)).length
}

const errorHasSeverity = (error) => {
  return error.severity !== undefined
}

const updateHighestSeverity = (errors) => {
  let severity = 0
  for (const error of errors) {
    if (!errorHasSeverity(error)) {
      severity = 2
    } else {
      if (severity < severityToInteger[error.severity]) {
        severity = severityToInteger[error.severity]
      }
    }
  }
  return severity
}

const getSeverityString = (severityInteger) => {
  return Object.keys(severityToInteger).find((key) => severityToInteger[key] === severityInteger)
}
