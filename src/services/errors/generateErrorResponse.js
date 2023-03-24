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

export const ERROR_SEVERITY_ERROR = 'error'
export const ERROR_SEVERITY_WARNING = 'warning'
export const ERROR_SEVERITY_INFO = 'info'

export const ERROR_CODE_ZIP_FILE_DOES_NOT_CONTAINS_METADATA_FILE = 1
export const ERROR_CODE_ZIP_FILE_DOES_NOT_CONTAINS_TEMPLATE_FILES = 2
export const ERROR_CODE_CANNOT_CHANGE_CONSENTS_ON_CHILD_SITE = 3

export default generateErrorResponse
