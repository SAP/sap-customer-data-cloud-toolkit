/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { ERROR_SEVERITY_ERROR, ERROR_SEVERITY_WARNING, ERROR_SEVERITY_INFO } from '../../services/errors/generateErrorResponse'

export const errorObject = {
  severity: ERROR_SEVERITY_ERROR,
}

export const errorsWithAllSeverities = [{ severity: ERROR_SEVERITY_ERROR }, { severity: ERROR_SEVERITY_WARNING }, { severity: ERROR_SEVERITY_INFO }]

export const errorsWithWarningSeverity = [{ severity: ERROR_SEVERITY_WARNING }, { severity: ERROR_SEVERITY_INFO }]

export const errorsWithInfoSeverity = [{ severity: ERROR_SEVERITY_INFO }]
