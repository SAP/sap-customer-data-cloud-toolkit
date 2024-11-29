import axios from 'axios'
import { applyCommitConfig } from './githubUtils'
import VersionControl from './versionControl'

jest.mock('axios')
jest.mock('@octokit/rest')

describe('Revert', () => {
  test('Revert Flow', async () => {
    let mockGetCommit = [{ content: 'teste', content_url: 'teste', filename: 'src/versionControl/webSdk.json' }]

    let mockData = {
      sha: 'cd082512618469bda1afb8eebc4c1692d3d50b05',
      node_id: 'C_kwDONOvK_toAKGNkMDgyNTEyNjE4NDY5YmRhMWFmYjhlZWJjNGMxNjkyZDNkNTBiMDU',
      commit: {
        author: {
          name: 'iamGaspar',
          email: '48961605+iamGaspar@users.noreply.github.com',
          date: '2024-11-28T11:57:18Z',
        },
        committer: {
          name: 'iamGaspar',
          email: '48961605+iamGaspar@users.noreply.github.com',
          date: '2024-11-28T11:57:18Z',
        },
        message: 'Backup created',
        tree: {
          sha: '8f0a265adf35177b50983a69e876016d721c78b4',
          url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/git/trees/8f0a265adf35177b50983a69e876016d721c78b4',
        },
        url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/git/commits/cd082512618469bda1afb8eebc4c1692d3d50b05',
        comment_count: 0,
        verification: {
          verified: false,
          reason: 'unsigned',
          signature: null,
          payload: null,
          verified_at: null,
        },
      },
      url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/commits/cd082512618469bda1afb8eebc4c1692d3d50b05',
      html_url: 'https://github.com/iamGaspar/CDCVersionControl/commit/cd082512618469bda1afb8eebc4c1692d3d50b05',
      comments_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/commits/cd082512618469bda1afb8eebc4c1692d3d50b05/comments',
      author: {
        login: 'iamGaspar',
        id: 48961605,
        node_id: 'MDQ6VXNlcjQ4OTYxNjA1',
        avatar_url: 'https://avatars.githubusercontent.com/u/48961605?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/iamGaspar',
        html_url: 'https://github.com/iamGaspar',
        followers_url: 'https://api.github.com/users/iamGaspar/followers',
        following_url: 'https://api.github.com/users/iamGaspar/following{/other_user}',
        gists_url: 'https://api.github.com/users/iamGaspar/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/iamGaspar/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/iamGaspar/subscriptions',
        organizations_url: 'https://api.github.com/users/iamGaspar/orgs',
        repos_url: 'https://api.github.com/users/iamGaspar/repos',
        events_url: 'https://api.github.com/users/iamGaspar/events{/privacy}',
        received_events_url: 'https://api.github.com/users/iamGaspar/received_events',
        type: 'User',
        user_view_type: 'public',
        site_admin: false,
      },
      committer: {
        login: 'iamGaspar',
        id: 48961605,
        node_id: 'MDQ6VXNlcjQ4OTYxNjA1',
        avatar_url: 'https://avatars.githubusercontent.com/u/48961605?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/iamGaspar',
        html_url: 'https://github.com/iamGaspar',
        followers_url: 'https://api.github.com/users/iamGaspar/followers',
        following_url: 'https://api.github.com/users/iamGaspar/following{/other_user}',
        gists_url: 'https://api.github.com/users/iamGaspar/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/iamGaspar/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/iamGaspar/subscriptions',
        organizations_url: 'https://api.github.com/users/iamGaspar/orgs',
        repos_url: 'https://api.github.com/users/iamGaspar/repos',
        events_url: 'https://api.github.com/users/iamGaspar/events{/privacy}',
        received_events_url: 'https://api.github.com/users/iamGaspar/received_events',
        type: 'User',
        user_view_type: 'public',
        site_admin: false,
      },
      parents: [
        {
          sha: 'a30fcaeb2de083851200f3e24b76ef7f1293ff18',
          url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/commits/a30fcaeb2de083851200f3e24b76ef7f1293ff18',
          html_url: 'https://github.com/iamGaspar/CDCVersionControl/commit/a30fcaeb2de083851200f3e24b76ef7f1293ff18',
        },
      ],
      stats: {
        total: 6,
        additions: 3,
        deletions: 3,
      },
      files: [
        {
          sha: '6156ca422797ca3217007c3303573ebb264a9f39',
          filename: 'src/versionControl/webSdk.json',
          status: 'modified',
          additions: 3,
          deletions: 3,
          changes: 6,
          blob_url: 'https://github.com/iamGaspar/CDCVersionControl/blob/cd082512618469bda1afb8eebc4c1692d3d50b05/src%2FversionControl%2FwebSdk.json',
          raw_url: 'https://github.com/iamGaspar/CDCVersionControl/raw/cd082512618469bda1afb8eebc4c1692d3d50b05/src%2FversionControl%2FwebSdk.json',
          contents_url: 'https://api.github.com/repos/iamGaspar/CDCVersionControl/contents/src%2FversionControl%2FwebSdk.json?ref=cd082512618469bda1afb8eebc4c1692d3d50b05',
          patch:
            '@@ -1,10 +1,10 @@\n {\n-  "callId": "5aeffaeee921456daa801addf679e9a3",\n+  "callId": "498e52ea5e8e41ae9faf0cd4bf808d60",\n   "errorCode": 0,\n   "apiVersion": 2,\n   "statusCode": 200,\n   "statusReason": "OK",\n-  "time": "2024-11-28T11:55:41.203Z",\n+  "time": "2024-11-28T11:56:45.759Z",\n   "baseDomain": "dev.au.parent.gaspar.test",\n   "dataCenter": "eu1",\n   "trustedSiteURLs": [\n@@ -36,7 +36,7 @@\n   ],\n   "enableDataSharing": true,\n   "isCDP": false,\n-  "globalConf": "\\r\\n{\\r\\n    //Refactored 2 comits list of provider names to enable.\\r\\n    enabledProviders: \'*\',\\r\\n\\r\\n    // Define the language of Gigya\'s user interface and error message.\\r\\n    lang: \'en\',\\r\\n\\r\\n    // Bind globally to events.\\r\\n    customEventMap: {\\r\\n        eventMap: [{\\r\\n            events: \'*\',\\r\\n            args: [function(e) {\\r\\n                return e;\\r\\n            }],\\r\\n            method: function(e) {\\r\\n                if (e.fullEventName === \'login\') {\\r\\n                    // Handle login event here.\\r\\n                } else if (e.fullEventName === \'logout\') {\\r\\n                    // Handle logout event here.\\r\\n                }\\r\\n            }\\r\\n        }]\\r\\n    }\\r\\n}",\n+  "globalConf": "\\r\\n{\\r\\n    //Refactored 3 comits list of provider names to enable.\\r\\n    enabledProviders: \'*\',\\r\\n\\r\\n    // Define the language of Gigya\'s user interface and error message.\\r\\n    lang: \'en\',\\r\\n\\r\\n    // Bind globally to events.\\r\\n    customEventMap: {\\r\\n        eventMap: [{\\r\\n            events: \'*\',\\r\\n            args: [function(e) {\\r\\n                return e;\\r\\n            }],\\r\\n            method: function(e) {\\r\\n                if (e.fullEventName === \'login\') {\\r\\n                    // Handle login event here.\\r\\n                } else if (e.fullEventName === \'logout\') {\\r\\n                    // Handle logout event here.\\r\\n                }\\r\\n            }\\r\\n        }]\\r\\n    }\\r\\n}",\n   "invisibleRecaptcha": {\n     "SiteKey": "teste",\n     "Secret": "teste"',
        },
      ],
    }
    axios.mockResolvedValueOnce({ data: mockData })
    let sha = '3d9c02d9be43c2bb4f96bc5c6cd655b711f7f338'
    await applyCommitConfig(sha)
  })
})
