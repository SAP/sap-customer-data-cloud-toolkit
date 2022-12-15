const getSmsExpectedResponse = {
  callId: 'a38c4738ac6540208c0627aa6bdbc0b8',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: Date.now(),
  templates: {
    tfa: {
      globalTemplates: {
        templates: {
          en: 'Your verification code is: {{code}}',
          'pt-br': 'O seu código de verificação é:{{code}}',
        },
        defaultLanguage: 'en',
      },
      templatesPerCountryCode: {
        355: {
          templates: {
            en: '{{code}}',
            bg: '{{code}}',
          },
          defaultLanguage: 'en',
        },
        351: {
          templates: {
            en: '{{code}}',
            pt: '{{code}}',
          },
          defaultLanguage: 'pt',
        },
      },
    },
    otp: {
      globalTemplates: {
        templates: {
          en: 'Your verification code is: {{code}}',
          nl: 'Uw verificatiecode is: {{code}}',
        },
        defaultLanguage: 'en',
      },
      templatesPerCountryCode: {},
    },
  },
}

function getSmsExpectedResponseWithNoTemplates() {
  const clone = JSON.parse(JSON.stringify(getSmsExpectedResponse))
  delete clone.templates.tfa.globalTemplates.templates.en
  delete clone.templates.tfa.globalTemplates.templates['pt-br']
  delete clone.templates.tfa.templatesPerCountryCode[355]
  delete clone.templates.tfa.templatesPerCountryCode[351]
  delete clone.templates.otp.globalTemplates.templates.en
  delete clone.templates.otp.globalTemplates.templates.nl
  return clone
}

export { getSmsExpectedResponse, getSmsExpectedResponseWithNoTemplates }
