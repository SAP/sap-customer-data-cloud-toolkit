/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

const badRequest = 'Bad Request'
const invalidApiParam = 'Invalid ApiKey parameter'
const apiKey = 'apiKey'

const scExpectedGigyaResponseOk = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: 'callId',
  time: Date.now(),
}

const scExpectedGigyaResponseNotOk = {
  errorMessage: invalidApiParam,
  errorDetails: 'GSKeyBase is invalid, no version: apiKey',
  statusCode: 400,
  errorCode: 400093,
  statusReason: badRequest,
  callId: 'f659eb2a4590410c90cd55c25c8defa1',
  time: Date.now(),
}
const scExpectedGigyaResponseWithDifferentDataCenter = {
  errorMessage: 'Database error',
  statusCode: 500,
  errorCode: 500028,
  statusReason: 'Internal Server Error',
  callId: '5bb29720dc404dad94b5b6d4ac82c68d',
  time: Date.now(),
}

function getSiteConfigSuccessfullyMultipleMember(numberOfMembers) {
  const getSiteConfig = {
    callId: 'callId',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: Date.now(),
    baseDomain: 'a_b_c_',
    dataCenter: 'au1',
    trustedSiteURLs: ['a_b_c_site/*', '*.a_b_c_site/*'],
    tags: [],
    description: 'site',
    captchaProvider: 'Google',
    settings: {
      CNAME: '',
      shortURLDomain: '',
      shortURLRedirMethod: 'js',
      encryptPII: true,
    },
    siteGroupConfig: {
      enableSSO: false,
    },
    trustedShareURLs: ['bit.ly/*', 'fw.to/*', 'shr.gs/*', 'vst.to/*', 'socli.ru/*', 's.gigya-api.cn/*'],
    enableDataSharing: true,
    isCDP: false,
    invisibleRecaptcha: {},
    recaptchaV2: {},
    funCaptcha: {},
  }
  if (numberOfMembers > 0) {
    getSiteConfig.siteGroupConfig.members = []
  }
  for (let i = 0; i < numberOfMembers; ++i) {
    getSiteConfig.siteGroupConfig.members.push(apiKey)
  }
  if (numberOfMembers === 0) {
    getSiteConfig.siteGroupOwner = 'parentApiKey'
  }
  return getSiteConfig
}

export { scExpectedGigyaResponseOk, scExpectedGigyaResponseNotOk, scExpectedGigyaResponseWithDifferentDataCenter, getSiteConfigSuccessfullyMultipleMember }
