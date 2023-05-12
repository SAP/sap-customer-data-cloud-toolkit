/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { errorConditions } from '../errorConditions'

const initialState = {
  exportFile: undefined,
  isLoading: false,
  errors: [],
  isImportPopupOpen: false,
  showSuccessDialog: false,
  errorCondition: errorConditions.empty,
}

const initialStateWithExportFile = {
  exportFile: { test: 'test' },
  isLoading: false,
  errors: [],
  isImportPopupOpen: false,
  errorCondition: errorConditions.empty,
}

const initialStateWithErrors = {
  exportFile: undefined,
  isLoading: false,
  errors: [{ test: 'test' }],
  isImportPopupOpen: false,
  errorCondition: errorConditions.exportError,
}

const testAPIKey = 'aabbccddeeffgghhiijjkk'

const testHash = `/1234567/${testAPIKey}/user-interfacing/email-templates/`

const payloadWithErrors = { payload: { errorCode: 40000 } }

const payloadWithoutErrors = { payload: { errorCode: 0 } }

export { initialState, initialStateWithExportFile, initialStateWithErrors, testAPIKey, testHash, payloadWithErrors, payloadWithoutErrors }
