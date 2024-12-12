import { getCdcData, fetchCDCConfigs } from './cdcUtils'

describe('cdcUtils', () => {
  const mockContext = {
    getCdcData,
    webSdk: { get: jest.fn().mockResolvedValue('webSdkData') },
    dataflow: { search: jest.fn().mockResolvedValue('dataflowData') },
    emails: { get: jest.fn().mockResolvedValue('emailsData') },
    extension: { get: jest.fn().mockResolvedValue('extensionData') },
    policies: { get: jest.fn().mockResolvedValue('policiesData') },
    rba: { get: jest.fn().mockResolvedValue('rbaData') },
    riskAssessment: { get: jest.fn().mockResolvedValue('riskAssessmentData') },
    schema: { get: jest.fn().mockResolvedValue('schemaData') },
    screenSets: { get: jest.fn().mockResolvedValue('screenSetsData') },
    sms: { get: jest.fn().mockResolvedValue('smsData') },
    channel: { get: jest.fn().mockResolvedValue('channelData') },
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockContext.webSdk.get.mockResolvedValue('webSdkData')
    mockContext.dataflow.search.mockResolvedValue('dataflowData')
    mockContext.emails.get.mockResolvedValue('emailsData')
    mockContext.extension.get.mockResolvedValue('extensionData')
    mockContext.policies.get.mockResolvedValue('policiesData')
    mockContext.rba.get.mockResolvedValue('rbaData')
    mockContext.riskAssessment.get.mockResolvedValue('riskAssessmentData')
    mockContext.schema.get.mockResolvedValue('schemaData')
    mockContext.screenSets.get.mockResolvedValue('screenSetsData')
    mockContext.sms.get.mockResolvedValue('smsData')
    mockContext.channel.get.mockResolvedValue('channelData')
  })

  describe('getCdcData', () => {
    it('should return an array of promises', () => {
      const result = getCdcData.call(mockContext)
      expect(result).toEqual([
        { name: 'webSdk', promise: mockContext.webSdk.get() },
        { name: 'dataflow', promise: mockContext.dataflow.search() },
        { name: 'emails', promise: mockContext.emails.get() },
        { name: 'extension', promise: mockContext.extension.get() },
        { name: 'policies', promise: mockContext.policies.get() },
        { name: 'rba', promise: mockContext.rba.get() },
        { name: 'riskAssessment', promise: mockContext.riskAssessment.get() },
        { name: 'schema', promise: mockContext.schema.get() },
        { name: 'sets', promise: mockContext.screenSets.get() },
        { name: 'sms', promise: mockContext.sms.get() },
        { name: 'channel', promise: mockContext.channel.get() },
      ])
    })
  })

  describe('fetchCDCConfigs', () => {
    it('should fetch CDC configs successfully', async () => {
      const resultWebSdk = await mockContext.webSdk.get()
      console.log('webSdk:', resultWebSdk) // Log this to ensure it's returning the correct mock data.

      const result = await fetchCDCConfigs.call(mockContext)
      expect(result).toEqual({
        webSdk: 'webSdkData',
        dataflow: 'dataflowData',
        emails: 'emailsData',
        extension: 'extensionData',
        policies: 'policiesData',
        rba: 'rbaData',
        riskAssessment: 'riskAssessmentData',
        schema: 'schemaData',
        sets: 'screenSetsData',
        sms: 'smsData',
        channel: 'channelData',
      })
    })

    it('should throw an error if getCdcData does not return an array', async () => {
      const invalidContext = {
        getCdcData: jest.fn().mockReturnValue('not an array'),
      }

      await expect(fetchCDCConfigs.call(invalidContext)).rejects.toThrow('getCdcData must return an array')
    })
  })
})
