const getSocialsResponse = {
    statusCode: 200,
    errorCode: 0,
    statusReason: "OK",
    callId: "fa7e527cf6db4fa2a0aef90f06279e77",
    time: Date.now(),
    capabilities: "none",
    settings: "disableGooglePlusLoginScope",
    providers: {
        facebook: {
            app: {
                appID: "2083515",
                secertKey: "THE APPS SECRET KEY"
            },
            settings: {
                enableNativeSdk: false,
                canvasURL: "canvarURL",
                version: "2.0",
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
                httpsOnly: false
            }
        },
        twitter: {
            app: {
                consumerKey: "DBOmu9sPrtD",
                consumerSecret: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        googleplus: {
            app: {
                consumerKey: ""
            },
            settings: {
                enableNativeSdk: false,
                useCNAME: false,
                httpsOnly: false
            }
        },
        linkedin: {
            app: {
                apiKey: "TlAcItfqKG11m4VkSp4d58SJ1Pv",
                secretKey: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        apple: {
            app: {
                ServiceID: ""
            },
            settings: {
                keyId: "",
                teamId: "",
                useCNAME: false,
                httpsOnly: false
            }
        },
        yahoo: {
            app: {
                appID: "",
                consumerKey: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        microsoft: {
            app: {
                clientID: "e61d297b-beea-4ead",
                secretKey: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        foursquare: {
            app: {
                clientID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        renren: {
            app: {
                consumerKey: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        qq: {
            app: {
                appID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        sina: {
            app: {
                appKey: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        vkontakte: {
            app: {
                apiKey: "574",
                secretKey: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        mixi: {
            app: {
                consumerKey: "",
                identificationKey: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        yahoojapan: {
            app: {
                appID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        spiceworks: {
            app: {
                consumerKey: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        instagram: {
            app: {
                clientID: "ef611346757d4",
                clientSecret: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        odnoklassniki: {
            app: {
                publicKey: "",
                applicationID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        amazon: {
            app: {
                accessKey: "bb8071b6f7cd1eba",
                secretAccessKey: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        xing: {
            app: {
                accessKeyID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        wechat: {
            app: {
                appID: "wx2afc8d50",
                secretAccessKey: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        paypal: {
            app: {
                clientID: "MhH7AehiR",
                secretKey: "THE APPS SECRET KEY"
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        line: {
            app: {
                clientID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        naver: {
            app: {
                clientID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        kakao: {
            app: {
                clientID: ""
            },
            settings: {
                useCNAME: false,
                httpsOnly: false
            }
        },
        docCheck: {
            app: {
                clientID: ""
            },
            settings: {
                Language: "com",
                useCNAME: false,
                httpsOnly: false
            }
        }
    }
}

const expectedSetSocialsProvidersResponse = {
    statusCode: 200,
    errorCode: 0,
    statusReason: "OK",
    callId: "58efd666bed94babae26f5e9132295c2",
    time: Date.now()
}

export {
    getSocialsResponse,
    expectedSetSocialsProvidersResponse
}