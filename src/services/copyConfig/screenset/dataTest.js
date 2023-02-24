import { expectedSchemaResponse } from '../schema/dataTest'

export const expectedScreenSetResponse = {
  callId: '5a4395b432794df383c2a35740ae90b0',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-23T16:19:57.815Z',
  screenSets: [
    {
      screenSetID: 'Default-LinkAccounts',
      html: '<div class="gigya-screen-set" id="Default-LinkAccounts" data-on-pending-registration-screen="Default-RegistrationLogin/gigya-complete-registration-screen" data-on-pending-verification-screen="Default-RegistrationLogin/gigya-email-verification-screen" data-on-pending-tfa-registration-screen="Default-RegistrationLogin/gigya-tfa-registration-screen" data-on-pending-tfa-verification-screen="Default-RegistrationLogin/gigya-tfa-verification-screen" data-on-pending-password-change-screen="Default-RegistrationLogin/gigya-password-change-required-screen" data-on-existing-login-identifier-screen="Default-LinkAccounts/gigya-link-account-screen" data-on-pending-recent-login-screen="Default-ReAuthentication/gigya-reauthentication-screen" data-on-accounts-linked-screen="_finish" data-width="" data-responsive="true" data-start-screen="gigya-link-account-screen" data-dialog-style="modern" data-wizard-migration-keys="migrate_translation_handlers_unique_key">\r\n    <div id="gigya-link-account-screen" data-width="auto" class="gigya-screen v2 gigya-link-account-screen portrait" gigya-conditional:class="viewport.width < 500? gigya-screen v2 gigya-link-account-screen portrait mobile: gigya-screen v2 gigya-link-account-screen portrait" gigya-expression:data-caption="screenset.translations[\'GIGYA_LINK_ACCOUNT_SCREEN_CAPTION\']">',
      css: '.gigya-screen-caption{font-family:arial;padding-left:11px;line-height:40px}.gigya-screen,.gigya-screen *{margin:0 auto;padding:0;border:none;color:inherit;text-decoration:none;width:auto;float:none;border-radius:0;font-size:15px;color:#4e515e;text-align:left;font-family:arial;box-sizing:content-box}.gigya-locale-ar .gigya-checkbox-text,.gigya-locale-ar .gigya-composite-control-header,.gigya-locale-ar .gigya-composite-control-label,.gigya-locale-ar .gigya-composite-control-link',
      javascript: '',
      metadata: {
        version: 1,
        lastModified: 1667560399,
        desc: '',
        designerHtml:
          '<div class="gigya-screen-set" id="Default-LinkAccounts" data-on-pending-registration-screen="Default-RegistrationLogin/gigya-complete-registration-screen" data-on-pending-verification-screen="Default-RegistrationLogin/gigya-email-verification-screen" data-on-pending-tfa-registration-screen="Default-RegistrationLogin/gigya-tfa-registration-screen" data-on-pending-tfa-verification-screen="Default-RegistrationLogin/gigya-tfa-verification-screen" data-on-pending-password-change-screen="Default-RegistrationLogin/gigya-password-change-required-screen" data-on-existing-login-identifier-screen="Default-LinkAccounts/gigya-link-account-screen" data-on-pending-recent-login-screen="Default-ReAuthentication/gigya-reauthentication-screen" data-on-accounts-linked-screen="_finish" data-width="" data-responsive="true" data-start-screen="gigya-link-account-screen" data-dialog-style="modern" data-wizard-migration-keys="migrate_translation_handlers_unique_key">\n    <div id="gigya-link-account-screen" data-width="auto" data-caption="Account Linking" class="gigya-screen v2 gigya-link-account-screen portrait gigya-composite-control-active" gigya-conditional:class="viewport.width < 500? gigya-screen v2 gigya-link-account-screen portrait mobile: gigya-screen v2 gigya-link-account-screen portrait" style="display: block;">',
        comment: 'Created via UI Builder',
      },
      translations: {
        default: {
          HEADER_119803489452460820_LABEL: 'Log in with an existing site account:',
          HEADER_145260704159400830_LABEL: 'To connect with your existing account, please enter your password:',
          HEADER_52718613360185736_LABEL: 'Log in with an existing social network:',
          HEADER_66766754253798720_LABEL: 'This is the first time you have logged in with a social network.',
          HEADER_88485663979193280_LABEL: 'You have previously logged in with a different account. To link your accounts, please re-authenticate.',
          HEADER_89162232959083470_LABEL: 'To connect with your existing account, click below:',
          LABEL_112643507797719220_LABEL: '<span>or</span>',
          LINK_142602221192631200_LABEL: 'Forgot password?',
          LINK_45513825813050510_LABEL: 'Create a new account',
          LINK_9616838104955976_LABEL: 'Create a new account',
          PASSWORD_112529999536342910_PLACEHOLDER: 'Password',
          GIGYA_LINK_ACCOUNT_SCREEN_CAPTION: 'Account Linking',
          SUBMIT_36585504925953250_VALUE: 'Submit',
          TEXTBOX_9521252200460624_PLACEHOLDER: 'Email',
          LABEL_146159809074249440_LABEL: 'Please enter your email address to reset your password:',
          LINK_26804378547945756_LABEL: 'Back to Login',
          GIGYA_FORGOT_PASSWORD_SCREEN_CAPTION: 'Forgot Password',
          SUBMIT_46444294851811950_VALUE: 'Submit',
          TEXTBOX_42422219216322590_LABEL: 'Email:',
          LABEL_136017248495193460_LABEL: 'An email regarding your password change has been sent to your email address.',
          LINK_37583182803889800_LABEL: '<input type="button" value="Back to Login">',
          GIGYA_FORGOT_PASSWORD_SUCCESS_SCREEN_CAPTION: 'Forgot Password',
        },
      },
      rawTranslations: '',
      compressionType: 1,
    },
  ],
}

export function getScreenSetExpectedBody(apiKey) {
  const expectedBody = JSON.parse(JSON.stringify(expectedScreenSetResponse))
  expectedBody.context = { targetApiKey: apiKey, id: expectedScreenSetResponse.screenSets[0].screenSetID }
  delete expectedBody.rawTranslations
  delete expectedBody.compressionType
  return expectedBody.screenSets[0]
}
