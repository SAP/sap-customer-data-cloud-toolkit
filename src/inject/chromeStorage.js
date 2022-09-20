// Watch for changes to the user's options & apply them
export let state = {
	userKey: '',
	secretKey: '',
	partnerId: '',
	apiKey: '',
}

export const initChromeStorage = () => {
	if (
		!window.chrome ||
		!window.chrome.storage ||
		!window.chrome.storage.local
	) {
		console.log('Error: Unable to user window.chrome.storage.')
		return
	}

	window.chrome.storage.local.get(
		['userKey', 'secretKey'],
		({ userKey, secretKey }) => (state = { userKey, secretKey }),
	)

	window.chrome.storage.onChanged.addListener((changes, area) => {
		if (area === 'local') {
			if (changes.userKey) state.userKey = changes.userKey.newValue
			if (changes.secretKey) state.secretKey = changes.secretKey.newValue
		}
	})
}
