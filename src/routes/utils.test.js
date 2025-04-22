import { setEventListenersForRoute } from './utils'

describe('route utils test suite', () => {
  let callbackMock, setAreEventListenersAttachedMock

  beforeEach(() => {
    callbackMock = jest.fn()
    setAreEventListenersAttachedMock = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.removeEventListener('hashchange', callbackMock)
    document.removeEventListener('click', callbackMock)
  })

  it('should attach event listeners when they are not already attached', () => {
    setEventListenersForRoute(false, setAreEventListenersAttachedMock, callbackMock)
    expect(setAreEventListenersAttachedMock).toHaveBeenCalledWith(true)
  })

  it('should not attach event listeners when they are already attached', () => {
    setEventListenersForRoute(true, setAreEventListenersAttachedMock, callbackMock)
    expect(setAreEventListenersAttachedMock).not.toHaveBeenCalled()
  })

  it('should call callback with new URL on hashchange event', () => {
    setEventListenersForRoute(false, setAreEventListenersAttachedMock, callbackMock)
    const newURL = 'http://example.com/#new'
    const event = new Event('hashchange')
    Object.defineProperty(event, 'newURL', { value: newURL })
    window.dispatchEvent(event)
    expect(callbackMock).toHaveBeenCalledWith(newURL)
  })

  it('should call callback with hash after clicking change site button', () => {
    jest.useFakeTimers()
    setEventListenersForRoute(false, setAreEventListenersAttachedMock, callbackMock)
    const button = document.createElement('button')
    button.innerText = ' Change Site '
    document.body.appendChild(button)
    button.click()
    jest.runAllTimers()
    try {
      expect(callbackMock).toHaveBeenCalledWith(window.location.hash)
    } finally {
      document.body.removeChild(button)
    }
  })

  it('should call callback with hash after clicking go to parent button', () => {
    jest.useFakeTimers()
    setEventListenersForRoute(false, setAreEventListenersAttachedMock, callbackMock)
    const button = document.createElement('button')
    button.innerText = ' Go To Parent '
    document.body.appendChild(button)
    button.click()
    jest.runAllTimers()
    try {
      expect(callbackMock).toHaveBeenCalledWith(window.location.hash)
    } finally {
      document.body.removeChild(button)
    }
  })

  it('should not call callback for unrelated click events', () => {
    jest.useFakeTimers()
    setEventListenersForRoute(false, setAreEventListenersAttachedMock, callbackMock)
    const unrelatedButton = document.createElement('button')
    unrelatedButton.innerText = ' Unrelated Button '
    document.body.appendChild(unrelatedButton)
    unrelatedButton.click()
    jest.runAllTimers()
    try {
      expect(callbackMock).not.toHaveBeenCalled()
    } finally {
      document.body.removeChild(unrelatedButton)
    }
  })
})