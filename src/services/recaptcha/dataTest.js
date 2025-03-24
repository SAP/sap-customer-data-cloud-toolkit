/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

export const recaptchaExpectedResponse = {
  Config: [
    { Type: 1, Key: 'test', Secret: 'test' },
    { Type: 3, Key: 'test', Secret: 'test' },
    { Type: 2, Key: 'test', Secret: 'test' },
    { Type: 4, Key: '', Secret: '' },
  ],
}

export const recaptchaPoliciesResponse = {
  registration: {
    requireCaptcha: false,
    requireSecurityQuestion: true,
    requireLoginID: true,
    enforceCoppa: true,
  },
  gigyaPlugins: {
    connectWithoutLoginBehavior: 'alwaysLogin',
    defaultRegScreenSet: 'Default-RegistrationLogin',
    defaultMobileRegScreenSet: 'Default-RegistrationLogin',
    sessionExpiration: 99,
    rememberSessionExpiration: 99,
  },
  accountOptions: {
    allowUnverifiedLogin: true,
    defaultLanguage: 'en',
    loginIdentifierConflict: 'failOnSiteConflictingIdentity',
    loginIdentifiers: 'email',
    preventLoginIDHarvesting: true,
    sendAccountDeletedEmail: false,
    sendWelcomeEmail: false,
    useCodeVerification: true,
    verifyEmail: true,
    verifyProviderEmail: true,
  },
  passwordComplexity: {
    minCharGroups: 15,
    minLength: 99,
  },
  security: {
    accountLockout: {
      threshold: 5,
      duration: 15,
    },
    captcha: {
      enabled: true,
    },
    ipLockout: {
      threshold: 10,
      duration: 30,
    },
    passwordChangeInterval: 25,
    passwordHistorySize: 7,
  },
  federation: {
    allowMultipleIdentities: false,
  },
  passwordReset: {
    requireSecurityCheck: false,
    tokenExpiration: 3600,
    sendConfirmationEmail: false,
    defaultLanguage: 'en',
    emailTemplates: {},
  },
  profilePhoto: {
    thumbnailWidth: 64,
    thumbnailHeight: 64,
  },
  twoFactorAuth: {
    providers: [{ type: 'SMS', enabled: true }],
    emailProvider: { enabled: true },
    smsProvider: { enabled: true },
  },
  rba: {
    riskPolicies: [{ id: 1, action: 'alert' }],
    defaultPolicy: '_off',
    allowOverride: 'no',
  },
}

export const riskProvidersResponse = {
  config: {
    subscriberId: '',
    account: '',
    environment: 0,
    integrationPoint: '',
  },
  configType: 0,
  siteId: 541014568338,
}

export function getRecaptchaExpectedResponse() {
  return {
    callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2024-08-30T08:22:37.389Z',
    Config: recaptchaExpectedResponse.Config,
  }
}

export function getRecaptchaPoliciesResponse() {
  return {
    callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2024-08-30T08:22:37.389Z',
    ...recaptchaPoliciesResponse,
  }
}

export function getRiskProvidersResponse() {
  return {
    callId: 'ea4861dc2cab4c01ab265ffe3eab6c71',
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2024-08-30T08:22:37.389Z',
    ...riskProvidersResponse,
  }
}

export function getCombinedResponse() {
  return {
    errorCode: recaptchaExpectedResponse.errorCode,
    recaptchaConfig: recaptchaExpectedResponse.Config,
    securityPolicies: recaptchaPoliciesResponse.security,
    registrationPolicies: recaptchaPoliciesResponse.registration,
    riskProvidersConfig: riskProvidersResponse.config,
  }
}
