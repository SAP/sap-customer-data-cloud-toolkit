import UrlBuilder from "./urlBuilder";

describe('URL Builder test suite', () => {
    const namespace = 'namespace'
    const endpoint = 'endpoint'

    const consoleUndefined = [
        ['us1', undefined],
        ['eu1', undefined],
        ['au1', undefined]
    ]
    test.each(consoleUndefined)('buildUrl with data center defined and console undefined', (dataCenter, gigyaConsole) => {
        testWithDataCenter(dataCenter, gigyaConsole)
    })

    const consoleGigyaCom = [
        ['us1', 'console.gigya.com'],
        ['eu1', 'console.gigya.com'],
        ['au1', 'console.gigya.com']
    ]
    test.each(consoleGigyaCom)('buildUrl with data center defined and console console.gigya.com', (dataCenter, gigyaConsole) => {
        testWithDataCenter(dataCenter, gigyaConsole)
    })

    const consoleCdcCloudSap = [
        ['us1', 'console.cdc.cloud.sap'],
        ['eu1', 'console.cdc.cloud.sap'],
        ['au1', 'console.cdc.cloud.sap']
    ]
    test.each(consoleCdcCloudSap)('buildUrl with data center defined and console console.gigya.com', (dataCenter, gigyaConsole) => {
        testWithDataCenter(dataCenter, gigyaConsole)
    })

    test('buildUrl with data center cn1 and console console.cn1.sapcdm.cn', async () => {
        const dataCenter = 'cn1'
        testWithDataCenter(dataCenter, 'console.cn1.sapcdm.cn')
    })

    test('buildUrl with data center eu2 and console console.eu2.gigya.com', async () => {
        const dataCenter = 'eu2'
        testWithDataCenter(dataCenter, 'console.eu2.gigya.com')
    })

    test('buildUrl with undefined data center and console default', async () => {
        const url = UrlBuilder.buildUrl(namespace, undefined, endpoint, undefined)
        expect(url).toBe(`https://${namespace}.us1.gigya.com/${endpoint}`)
    })

    test('buildUrl with undefined data center and console console.eu2.gigya.com', async () => {
        const console = 'console.eu2.gigya.com'
        const url = UrlBuilder.buildUrl(namespace, undefined, endpoint, console)
        expect(url).toBe(`https://${namespace}.eu2.${getDomain(console)}/${endpoint}`)
    })

    test('buildUrl with undefined data center and console console.cn1.sapcdm.cn', async () => {
        const console = 'console.cn1.sapcdm.cn'
        const url = UrlBuilder.buildUrl(namespace, undefined, endpoint, console)
        expect(url).toBe(`https://${namespace}.cn1.${getDomain(console)}/${endpoint}`)
    })

    function testWithDataCenter(dataCenter, gigyaConsole) {
        const url = UrlBuilder.buildUrl(namespace, dataCenter, endpoint, gigyaConsole)
        expect(url).toBe(`https://${namespace}.${dataCenter}.${getDomain(gigyaConsole)}/${endpoint}`)
    }

    function getDomain(gigyaConsole) {
        return gigyaConsole === 'console.cn1.sapcdm.cn' ? 'sapcdm.cn' : 'gigya.com'
    }
})
