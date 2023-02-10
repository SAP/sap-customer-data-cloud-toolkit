export const expectedGetPartnersResponseOk = {
  callId: 'c5bb6737b2124c36a93ee840ffe5d3e9',
  errorCode: 0,
  apiVersion: 2,
  statusCode: 200,
  statusReason: 'OK',
  time: '2023-02-08T14:03:08.655Z',
  partners: [
    {
      partner: {
        PartnerID: 12345678,
        Name: 'SAP Customer Data Cloud',
        Enabled: true,
        Invalidated: false,
        Homepage: 'www.gigya.com',
        IsPaying: false,
        IsCDP: false,
        Created: '2020-03-09T14:43:52',
        LastUpdated: '2022-07-22T17:20:32',
        DefaultDataCenter: 'eu1',
        Licenses: {
          ds: {
            Enabled: true,
          },
          gm: {
            Enabled: false,
          },
          b2b: {
            Enabled: true,
          },
          cdp: {
            Enabled: false,
          },
          ids: {
            Enabled: true,
          },
          chat: {
            Enabled: false,
          },
          ecpm: {
            Enabled: true,
          },
          audit: {
            Enabled: true,
          },
          nexus: {
            Enabled: false,
            Features: [],
          },
          samlIdp: {
            Enabled: true,
          },
          accounts: {
            Enabled: true,
            Features: ['insights'],
          },
          comments: {
            Enabled: true,
          },
          statusPage: {
            Enabled: true,
          },
          liteAccount: {
            Enabled: true,
          },
          subscriptions: {
            Enabled: true,
          },
          disableAccountLoggedInWebhook: {
            Enabled: false,
          },
        },
        IsMigratedToSoa: true,
        IsSapCustomer: true,
        TenantID: 'cpr_internal',
        AuditRetention: 12,
      },
      errorCode: 0,
      statusCode: 200,
      errorMessage: 'OK',
    },
    {
      partner: {
        PartnerID: 22345678,
        Name: 'SAP Customer Data Cloud B2B',
        Enabled: true,
        Invalidated: false,
        Homepage: '',
        IsPaying: true,
        IsCDP: false,
        Created: '2022-05-17T09:56:43',
        LastUpdated: '2022-05-18T13:10:27',
        DefaultDataCenter: 'eu1',
        Licenses: {
          ds: {
            Enabled: true,
          },
          b2b: {
            Enabled: true,
          },
          cdp: {
            Enabled: false,
          },
          ids: {
            Enabled: true,
          },
          ecpm: {
            Enabled: true,
          },
          audit: {
            Enabled: true,
          },
          nexus: {
            Enabled: false,
          },
          samlIdp: {
            Enabled: true,
          },
          accounts: {
            Enabled: true,
            Features: ['insights'],
          },
          statusPage: {
            Enabled: true,
          },
          liteAccount: {
            Enabled: true,
          },
          subscriptions: {
            Enabled: true,
          },
          disableAccountLoggedInWebhook: {
            Enabled: false,
          },
        },
        IsMigratedToSoa: true,
        IsSapCustomer: false,
        TenantID: 'b2b-internal',
        AuditRetention: 12,
      },
      errorCode: 0,
      statusCode: 200,
      errorMessage: 'OK',
    },
  ],
}

export function getExpectedGetPartnerSitesResponseOk(instance) {
  return {
    callId: '72f2108b116547cc9759d95da0a7fc73',
    context: expectedGetPartnersResponseOk.partners[instance].partner.PartnerID,
    errorCode: 0,
    apiVersion: 2,
    statusCode: 200,
    statusReason: 'OK',
    time: '2023-02-08T14:11:15.821Z',
    lastPageSiteId: 145051326118,
    sites: [
      {
        name: `a.domain.com${instance}`,
        apiKey: '3_oAyqEurF4',
        tags: [],
        datacenter: 'eu1',
        description: 'Local Environment',
        siteID: 11917765,
        licensesAccountsEnabled: true,
        enableTags: true,
        enableReports: true,
        enableCustomerInsights: true,
        enableIdentityAccess: true,
        enableIdentityQueryTool: true,
        enableDeleteSite: true,
        isGlobalSite: false,
        globalSiteSettings: {},
        group: {
          isGroupMaster: false,
        },
      },
      {
        name: `a.b.domain.com${instance}`,
        apiKey: '4_bNKFMOGCv0WQdviqedhdLQ',
        tags: [],
        datacenter: 'eu1',
        description: 'Test with Hosted Pages',
        siteID: 119557486635,
        licensesAccountsEnabled: true,
        enableTags: true,
        enableReports: true,
        enableCustomerInsights: true,
        enableIdentityAccess: true,
        enableIdentityQueryTool: true,
        enableDeleteSite: true,
        isGlobalSite: false,
        globalSiteSettings: {},
        group: {
          masterApiKey: '3_SYpPOsuPre',
          isGroupMaster: false,
        },
      },
      {
        name: `c.other.com${instance}`,
        apiKey: '4_f0504OmEy4FLA',
        tags: [],
        datacenter: 'eu1',
        description: '',
        siteID: 1214563,
        licensesAccountsEnabled: true,
        enableTags: true,
        enableReports: true,
        enableCustomerInsights: true,
        enableIdentityAccess: true,
        enableIdentityQueryTool: true,
        enableDeleteSite: true,
        isGlobalSite: false,
        globalSiteSettings: {},
        group: {
          masterApiKey: '4_quzKvxpUGqyZ',
          isGroupMaster: false,
        },
      },
    ],
    enableCreateSite: true,
  }
}
