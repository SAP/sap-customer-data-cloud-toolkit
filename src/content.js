/*global chrome*/

chrome.runtime.sendMessage('get-user-data', (response) => {
  // 3. Got an asynchronous response with the data from the service worker
  console.log('received user data', response)
})
