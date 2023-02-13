import {expectedSchemaResponse} from "../schema/dataTest";

export function getSocialsProviders(socialsCredentials) {
  const getSocialsResponse = {
    statusCode: 200,
    errorCode: 0,
    statusReason: 'OK',
    callId: 'fa7e527cf6db4fa2a0aef90f06279e77',
    time: Date.now(),
    capabilities: 'none',
    settings: 'disableGooglePlusLoginScope',
    providers: {
      facebook: {
        app: {
          appID: '',
          secertKey: '',
        },
        settings: {
          enableNativeSdk: false,
          canvasURL: 'canvarURL',
          version: '2.0',
          enableWebsite: false,
          enableRelationships: false,
          enableReligion: false,
          enableBirthday: false,
          enableCity: false,
          enableFriendsList: true,
          enableAboutMe: false,
          enableEducationHistory: false,
          enableWorkHistory: false,
          enableHometown: false,
          enableGender: false,
          useCNAME: false,
          httpsOnly: false,
        },
      },
      twitter: {
        app: {
          consumerKey: socialsCredentials,
          consumerSecret: socialsCredentials,
        },
        settings: {
          useCNAME: false,
          httpsOnly: false,
        },
      },
      googleplus: {
        app: {
          consumerKey: '',
        },
        settings: {
          enableNativeSdk: false,
          useCNAME: false,
          httpsOnly: false,
        },
      },
      linkedin: {
        app: {
          apiKey: socialsCredentials,
          secretKey: socialsCredentials,
        },
        settings: {
          useCNAME: false,
          httpsOnly: false,
        },
      },
      apple: {
        app: {
          ServiceID: '',
        },
        settings: {
          keyId: '',
          teamId: '',
          useCNAME: false,
          httpsOnly: false,
        },
      },
    },
  }
  return getSocialsResponse
}

const expectedSetSocialsProvidersResponse = {
  statusCode: 200,
  errorCode: 0,
  statusReason: 'OK',
  callId: '58efd666bed94babae26f5e9132295c2',
  time: Date.now(),
}

function getExpectedSetSocialsProvidersResponseWithContext(apiKey) {
  const expectedResponse = JSON.parse(JSON.stringify(expectedSetSocialsProvidersResponse))
  expectedResponse.context = { targetApiKey: apiKey, id: 'socialIdentities' }
  return expectedResponse
}

export { expectedSetSocialsProvidersResponse, getExpectedSetSocialsProvidersResponseWithContext }
