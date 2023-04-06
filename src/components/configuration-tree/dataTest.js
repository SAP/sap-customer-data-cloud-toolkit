import { ERROR_SEVERITY_ERROR, ERROR_SEVERITY_WARNING, ERROR_SEVERITY_INFO } from '../../services/errors/generateErrorResponse'

export const errorObject = {
  severity: ERROR_SEVERITY_ERROR,
}

export const errorsWithAllSeverities = [{ severity: ERROR_SEVERITY_ERROR }, { severity: ERROR_SEVERITY_WARNING }, { severity: ERROR_SEVERITY_INFO }]

export const errorsWithWarningSeverity = [{ severity: ERROR_SEVERITY_WARNING }, { severity: ERROR_SEVERITY_INFO }]

export const errorsWithInfoSeverity = [{ severity: ERROR_SEVERITY_INFO }]
