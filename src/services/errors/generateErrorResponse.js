/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

function generateErrorResponse(error, message) {
  return error.response
    ? error.response
    : {
        data: {
          errorCode: error.code,
          errorDetails: error.details ? error.details : error.message,
          errorMessage: message,
          time: Date.now(),
        },
      }
}

export const ERROR_SEVERITY_ERROR = 'Error'
export const ERROR_SEVERITY_WARNING = 'Warning'
export const ERROR_SEVERITY_INFO = 'Information'

export const ERROR_CODE_ZIP_FILE_DOES_NOT_CONTAINS_METADATA_FILE = 1
export const ERROR_CODE_ZIP_FILE_DOES_NOT_CONTAINS_TEMPLATE_FILES = 2
export const ERROR_CODE_CANNOT_CHANGE_CONSENTS_ON_CHILD_SITE = 3
export const ERROR_CODE_CANNOT_CHANGE_DATA_SCHEMA_FIELD_TYPE = 4

export default generateErrorResponse
