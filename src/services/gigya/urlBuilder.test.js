import UrlBuilder from './urlBuilder'

describe('URL Builder test suite', () => {
  const namespace = 'namespace'
  const endpoint = 'endpoint'
  const federatedPrefix = 'au.my'
  const consoleGigyaCom = 'console.gigya.com'
  const federatedConsoleGigyaCom = federatedPrefix + consoleGigyaCom
  const consoleUs1GigyaCom = 'console.us1.gigya.com'
  const federatedConsoleUs1GigyaCom = federatedPrefix + consoleUs1GigyaCom
  const consoleCdcCloudSap = 'console.cdc.cloud.sap'
  const federatedConsoleCdcCloudSap = federatedPrefix + consoleCdcCloudSap
  const consoleUs1CdcCloudSap = 'console.us1.cdc.cloud.sap'
  const federatedConsoleUs1CdcCloudSap = federatedPrefix + consoleCdcCloudSap

  const consoleUndefined = [
    ['us1', undefined],
    ['eu1', undefined],
    ['au1', undefined],
  ]
  test.each(consoleUndefined)('buildUrl with data center defined and console undefined', (dataCenter, gigyaConsole) => {
    testWithDataCenter(dataCenter, gigyaConsole)
  })

  const consolesGigyaCom = [
    ['us1', consoleGigyaCom],
    ['eu1', consoleGigyaCom],
    ['au1', consoleGigyaCom],
    ['au1', federatedConsoleGigyaCom],
    ['us1', consoleUs1GigyaCom],
    ['eu1', consoleUs1GigyaCom],
    ['au1', consoleUs1GigyaCom],
    ['au1', federatedConsoleUs1GigyaCom],
  ]
  test.each(consolesGigyaCom)('buildUrl with data center defined and console console.gigya.com', (dataCenter, gigyaConsole) => {
    testWithDataCenter(dataCenter, gigyaConsole)
  })

  const consolesCdcCloudSap = [
    ['us1', consoleCdcCloudSap],
    ['eu1', consoleCdcCloudSap],
    ['au1', consoleCdcCloudSap],
    ['au1', federatedConsoleCdcCloudSap],
    ['us1', consoleUs1CdcCloudSap],
    ['eu1', consoleUs1CdcCloudSap],
    ['au1', consoleUs1CdcCloudSap],
    ['au1', federatedConsoleUs1CdcCloudSap],
  ]
  test.each(consolesCdcCloudSap)('buildUrl with data center defined and console console.cdc.cloud.sap', (dataCenter, gigyaConsole) => {
    testWithDataCenter(dataCenter, gigyaConsole)
  })

  const consolesCn = [
    ['cn1', 'console.cn1.sapcdm.cn'],
    ['cn1', 'au.my.console.cn1.sapcdm.cn'],
  ]
  test.each(consolesCn)('buildUrl with data center cn1 and console console.cn1.sapcdm.cn', (dataCenter, gigyaConsole) => {
    testWithDataCenter(dataCenter, gigyaConsole)
  })

  const consolesEu2 = [
    ['eu2', 'console.eu2.gigya.com'],
    ['eu2', 'au.my.console.eu2.gigya.com'],
    ['eu2', 'console.eu2.cdc.cloud.sap'],
    ['eu2', 'au.my.console.eu2.cdc.cloud.sap'],
  ]
  test.each(consolesEu2)('buildUrl with data center eu2 and console console.eu2.gigya.com', (dataCenter, gigyaConsole) => {
    testWithDataCenter(dataCenter, gigyaConsole)
  })

  test('buildUrl with undefined data center and console default', () => {
    const url = UrlBuilder.buildUrl(namespace, undefined, endpoint, undefined)
    expect(url).toBe(`https://${namespace}.us1.gigya.com/${endpoint}`)
  })

  test('buildUrl with undefined data center and console console.eu2.gigya.com', () => {
    const console = 'console.eu2.gigya.com'
    const url = UrlBuilder.buildUrl(namespace, undefined, endpoint, console)
    expect(url).toBe(`https://${namespace}.eu2.${getDomain(console)}/${endpoint}`)
  })

  test('buildUrl with undefined data center and console console.cn1.sapcdm.cn', async () => {
    const console = 'console.cn1.sapcdm.cn'
    const url = UrlBuilder.buildUrl(namespace, undefined, endpoint, console)
    expect(url).toBe(`https://${namespace}.cn1.${getDomain(console)}/${endpoint}`)
  })

  test('buildUrl with undefined data center and console au.my.console.eu2.cdc.cloud.sap', async () => {
    const console = 'console.eu2.cdc.cloud.sap'
    const url = UrlBuilder.buildUrl(namespace, undefined, endpoint, console)
    expect(url).toBe(`https://${namespace}.eu2.${getDomain(console)}/${endpoint}`)
  })

  function testWithDataCenter(dataCenter, gigyaConsole) {
    const url = UrlBuilder.buildUrl(namespace, dataCenter, endpoint, gigyaConsole)
    expect(url).toBe(`https://${namespace}.${dataCenter}.${getDomain(gigyaConsole)}/${endpoint}`)
  }

  function getDomain(gigyaConsole) {
    const defaultDomain = 'gigya.com'
    if (!gigyaConsole) {
      return defaultDomain
    } else if (gigyaConsole.endsWith('sapcdm.cn')) {
      return 'sapcdm.cn'
    } else if (gigyaConsole.endsWith(defaultDomain)) {
      return 'gigya.com'
    } else if (gigyaConsole.endsWith('cdc.cloud.sap')) {
      return 'cdc.cloud.sap'
    }
    return ''
  }
})
