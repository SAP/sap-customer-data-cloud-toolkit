export const getHighestSeverity = (errors) => {
  if (Array.isArray(errors)) {
    const severityToInteger = { Error: 2, Warning: 1, Information: 0 }
    let severity = 0
    for (const error of errors) {
      if (severity < severityToInteger[error.severity]) {
        severity = severityToInteger[error.severity]
      }
    }
    return Object.keys(severityToInteger).find((key) => severityToInteger[key] === severity)
  } else {
    return errors.severity
  }
}
