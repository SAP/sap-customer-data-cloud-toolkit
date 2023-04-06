import { getHighestSeverity } from './utils'
import { errorObject, errorsWithAllSeverities, errorsWithWarningSeverity, errorsWithInfoSeverity } from './dataTest'
import { ERROR_SEVERITY_ERROR, ERROR_SEVERITY_WARNING, ERROR_SEVERITY_INFO } from '../../services/errors/generateErrorResponse'

describe('configuration tree utils test suite', () => {
  test('should return severity from an error object', () => {
    expect(getHighestSeverity(errorObject)).toEqual(ERROR_SEVERITY_ERROR)
  })

  test('should return severity error from an error array with all severities', () => {
    expect(getHighestSeverity(errorsWithAllSeverities)).toEqual(ERROR_SEVERITY_ERROR)
  })

  test('should return severity warning from an error array with warning and info severities', () => {
    expect(getHighestSeverity(errorsWithWarningSeverity)).toEqual(ERROR_SEVERITY_WARNING)
  })

  test('should return severity info from an error array with info severities', () => {
    expect(getHighestSeverity(errorsWithInfoSeverity)).toEqual(ERROR_SEVERITY_INFO)
  })
})
