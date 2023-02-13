import {expectedGigyaResponseOk} from "../servicesDataTest";

export function getExpectedResponseOkWithContext(id, apiKey) {
    const response = JSON.parse(JSON.stringify(expectedGigyaResponseOk))
    response.context = { targetApiKey: apiKey, id: id }
    return response
}

export const schemaId = 'dataSchema'
export const profileId = 'profileSchema'
export const socialIdentitiesId = 'socialIdentities'
export const smsTemplatesId = 'smsTemplates'
