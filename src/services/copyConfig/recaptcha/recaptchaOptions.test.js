import RecaptchaOptions from './recaptchaOptions.js'

describe('RecaptchaOptions test suite', () => {
  const mockRecaptchaConfiguration = { testConfig: 'configData' }
  const recaptchaOptions = new RecaptchaOptions(mockRecaptchaConfiguration)

  test('getConfiguration returns recaptcha configuration', () => {
    const config = recaptchaOptions.getConfiguration()
    expect(config).toEqual(mockRecaptchaConfiguration)
  })

  test('removeRecaptchaPolicies removes branches when info is valid', () => {
    const info = { branches: ['branch1', 'branch2'] }
    recaptchaOptions.removeRecaptchaPolicies(info)
    expect(info.branches).toEqual([])
  })

  test('removeRecaptchaPolicies logs warning when info is invalid', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    recaptchaOptions.removeRecaptchaPolicies(null) // Testing invalid info
    expect(consoleWarnSpy).toHaveBeenCalledWith('Recaptcha info is invalid or does not contain branches:', null)
    consoleWarnSpy.mockRestore()
  })
})
