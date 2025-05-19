const HASH_CHANGE_EVENT = 'hashchange'
const CLICK_EVENT = 'click'
const CHANGE_SITE_BUTTON_TEXT = ' Change Site '
const GO_TO_PARENT_BUTTON_TEXT = ' Go To Parent '

export const setEventListenersForRoute = (areEventListenersAttached, setAreEventListenersAttached, callback) => {
  if(!areEventListenersAttached) {
    setAreEventListenersAttached(true)
    window.addEventListener(HASH_CHANGE_EVENT, (event) => {
      callback(event.newURL)
    })

    document.addEventListener(CLICK_EVENT, (event) => {
      if(event.target.innerText === CHANGE_SITE_BUTTON_TEXT || event.target.innerText === GO_TO_PARENT_BUTTON_TEXT) {
        setTimeout(() => {
          callback(window.location.hash)
        }, 1000)
      }
    })
  }
}