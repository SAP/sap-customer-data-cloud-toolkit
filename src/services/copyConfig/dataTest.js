export function getResponseWithContext(response, id, apiKey) {
    const resp = JSON.parse(JSON.stringify(response))
    resp.context = { targetApiKey: apiKey, id: id }
    return resp
}

export const schemaId = 'dataSchema'
export const profileId = 'profileSchema'
export const socialIdentitiesId = 'socialIdentities'
export const smsTemplatesId = 'smsTemplates'
