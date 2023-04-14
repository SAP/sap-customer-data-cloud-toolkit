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
  return errors.filter((error) => error.severity !== undefined).length
}

const updateHighestSeverity = (errors) => {
  let severity = 0
  for (const error of errors) {
    if (severity < severityToInteger[error.severity]) {
      severity = severityToInteger[error.severity]
    }
  }
  return severity
}

const getSeverityString = (severityInteger) => {
  return Object.keys(severityToInteger).find((key) => severityToInteger[key] === severityInteger)
}
