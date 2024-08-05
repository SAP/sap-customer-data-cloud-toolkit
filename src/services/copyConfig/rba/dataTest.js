export const expectedGetRbaPolicyResponseOk = {
  callId: 'c5bb6737b2124c36a93ee840ffe5d3e9',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-08T14:03:08.655Z',
  policy: {
    commonRules: [
      {
        action: {
          duration: 600,
          scope: ['account'],
          type: 'lockout',
        },
        rootFactor: {
          type: 'failedLogins',
          scope: ['account'],
          threshold: 10,
          resetInterval: 3600,
        },
        id: 'Login max number of attempts',
        scope: 'Login',
        description: 'On multiple failed login attempts > lockout account',
        enabled: true,
      },
      {
        action: {
          scope: ['IP'],
          type: 'captcha',
        },
        rootFactor: {
          factors: [
            {
              type: 'highRisk',
              scope: ['account'],
              threshold: 0.8,
            },
            {
              type: 'apiKey',
              apiKeys: ['4_UbqVONGV8H_MUUFw2Bdf5Q'],
              inclusive: true,
            },
          ],
          type: 'all',
        },
        id: 'tfa high risk score',
        scope: 'Login',
        description: 'On high risk score > TFA',
        enabled: true,
      },
    ],
    rulesSets: [
      {
        rules: [
          {
            action: {
              authLevel: 10,
              challenge: 'none',
              type: 'TFA',
            },
            rootFactor: {
              type: 'device',
              expirationPeriod: 2592000,
              authLevel: 10,
            },
            id: null,
            scope: 'Login',
            description: 'On device change > force verification of auth level 10 or higher',
            enabled: true,
          },
        ],
        id: 'device_change_email_verification',
        description: 'On device change > force verification of auth level 10 or higher',
        enabled: true,
      },
      {
        rules: [],
        id: '_off',
        description: 'This policy represents a policy without any validations',
        enabled: true,
      },
    ],
    tfaRegistrationScope: false,
    defaultPolicy: 'device_change_email_verification',
    allowOverrideMode: 'no',
  },
}

export const expectedGetRiskAssessmentResponseOk = {
  callId: 'c5bb6737b2124c36a93ee840ffe5d3e9',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-08T14:03:08.655Z',
  Enabled: false,
}

export const expectedGetUnknownLocationNotificationResponseOk = {
  callId: 'c5bb6737b2124c36a93ee840ffe5d3e9',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-08T14:03:08.655Z',
  security: {
    accountLockout: {
      failedLoginThreshold: 0,
      lockoutTimeSec: 300,
      failedLoginResetSec: 0,
    },
    captcha: {
      failedLoginThreshold: 0,
    },
    ipLockout: {
      hourlyFailedLoginThreshold: 0,
      lockoutTimeSec: 0,
    },
    passwordChangeInterval: 0,
    passwordHistorySize: 0,
    riskAssessmentWithReCaptchaV3: false,
    riskAssessmentWithTransUnion: false,
    sendUnknownLocationNotification: false,
    signDeviceId: 'js_latest',
  },
}

export const expectedGetDestinationRbaPolicyResponseOk = {
  callId: 'destination_call_id',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-08T14:03:08.655Z',
  policy: {
    commonRules: [
      {
        action: {
          type: 'captcha',
        },
        rootFactor: {
          type: 'failedLogins',
          scope: ['account'],
          threshold: 5,
        },
        id: 'On multiple failed login attempts > force CAPTCHA on account',
        scope: 'Login',
        description: 'On multiple failed login attempts > force CAPTCHA on account',
        enabled: true,
      },
    ],
    rulesSets: [],
    tfaRegistrationScope: false,
    defaultPolicy: '',
    allowOverrideMode: 'no',
  },
}
