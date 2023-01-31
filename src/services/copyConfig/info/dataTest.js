export function getInfoExpectedResponse(supports) {
  return [
    {
      id: 'schema',
      name: 'schema',
      value: [
        {
          id: 'dataSchema',
          name: 'dataSchema',
          value: supports,
        },
        {
          id: 'profileSchema',
          name: 'profileSchema',
          value: supports,
        },
      ],
    },
    {
      id: 'screenSets',
      name: 'screenSets',
      value: [
        {
          id: 'default',
          name: 'default',
          value: [
            {
              id: 'defaultLinkAccounts',
              name: 'defaultLinkAccounts',
              value: false,
            },
            {
              id: 'defaultLiteRegistration',
              name: 'defaultLiteRegistration',
              value: false,
            },
          ],
        },
        {
          id: 'custom',
          name: 'custom',
          value: [
            {
              id: 'customLinkAccounts',
              name: 'customLinkAccounts',
              value: false,
            },
            {
              id: 'customLiteRegistration',
              name: 'customLiteRegistration',
              value: false,
            },
          ],
        },
      ],
    },
    {
      id: 'policies',
      name: 'policies',
      value: [
        {
          id: 'accountOptions',
          name: 'accountOptions',
          value: false,
        },
        {
          id: 'codeVerification',
          name: 'codeVerification',
          value: false,
        },
        {
          id: 'emailNotifications',
          name: 'emailNotifications',
          value: false,
        },
        {
          id: 'emailVerification',
          name: 'emailVerification',
          value: false,
        },
        {
          id: 'federation',
          name: 'federation',
          value: false,
        },
        {
          id: 'webSdk',
          name: 'webSdk',
          value: false,
        },
        {
          id: 'passwordComplexity',
          name: 'passwordComplexity',
          value: false,
        },
        {
          id: 'passwordReset',
          name: 'passwordReset',
          value: false,
        },
        {
          id: 'defaultProfilePhotoDimensions',
          name: 'defaultProfilePhotoDimensions',
          value: false,
        },
        {
          id: 'registration',
          name: 'registration',
          value: false,
        },
        {
          id: 'security',
          name: 'security',
          value: false,
        },
        {
          id: 'twoFactorAuthenticationProviders',
          name: 'twoFactorAuthenticationProviders',
          value: false,
        },
      ],
    },
    {
      id: 'socialIdentities',
      name: 'socialIdentities',
      value: false,
    },
    {
      id: 'emailTemplates',
      name: 'emailTemplates',
      value: [
        {
          id: 'magicLink',
          name: 'magicLink',
          value: false,
        },
        {
          id: 'codeVerification',
          name: 'codeVerification',
          value: false,
        },
        {
          id: 'emailVerification',
          name: 'emailVerification',
          value: false,
        },
        {
          id: 'newUserWelcome',
          name: 'newUserWelcome',
          value: false,
        },
        {
          id: 'accountDeletionConfirmation',
          name: 'accountDeletionConfirmation',
          value: false,
        },
        {
          id: 'litePreferencesCenter',
          name: 'litePreferencesCenter',
          value: false,
        },
        {
          id: 'doubleOptInConfirmation',
          name: 'doubleOptInConfirmation',
          value: false,
        },
        {
          id: 'etPasswordReset',
          name: 'passwordReset',
          passwordReset: false,
        },
        {
          id: 'tfaEmailVerification',
          name: 'tfaEmailVerification',
          value: false,
        },
        {
          id: 'impossibleTraveler',
          name: 'impossibleTraveler',
          value: false,
        },
        {
          id: 'passwordResetConfirmation',
          name: 'passwordResetConfirmation',
          value: false,
        },
      ],
    },
    {
      id: 'smsTemplates',
      name: 'smsTemplates',
      value: false,
    },
    {
      id: 'dataflows',
      name: 'dataflows',
      value: false,
    },
  ]
}
