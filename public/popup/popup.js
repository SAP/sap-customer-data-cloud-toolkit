chrome.storage.local.get(['userKey', 'secretKey'], ({ userKey, secretKey }) => {
  document.querySelector('#userKey').value = userKey || ''
  document.querySelector('#secretKey').value = secretKey || ''
})

const saveFieldValue = (e) => {
  let { name, value } = e.target
  chrome.storage.local.set({ [name]: value })
}

let inputUserKey = document.querySelector('#userKey')
inputUserKey.addEventListener('keyup', saveFieldValue)
inputUserKey.addEventListener('changed', saveFieldValue)
inputUserKey.addEventListener('paste', saveFieldValue)

let secretKey = document.querySelector('#secretKey')
secretKey.addEventListener('keyup', saveFieldValue)
secretKey.addEventListener('changed', saveFieldValue)
secretKey.addEventListener('paste', saveFieldValue)
