import axios from 'axios'
import * as SocialsTestData from './dataTest'
import Social from "./social";
import * as CommonTestData from '../../servicesDataTest'


jest.mock('axios')
jest.setTimeout(10000)
describe('Socials test suite',()=>{
    const social = new Social(
        CommonTestData.credentials.userKey,
        CommonTestData.credentials.secret,
        'apiKey',
        'us1')

    const targetDataCenter = 'us1'

    test('copy socials successfully', async()=>{
        axios.mockResolvedValueOnce({data: SocialsTestData.getSocialsResponse})
            .mockResolvedValueOnce({data:SocialsTestData.expectedSetSocialsProvidersResponse})
        const response = await social.copy("targetApiKey",targetDataCenter)
        CommonTestData.verifyResponseIsOk(response)
        expect(response.id).toEqual('Social;targetApiKey')
    })
    test('copy socials - invalid target api', async()=>{
        axios.mockResolvedValueOnce({data: SocialsTestData.getSocialsResponse})
            .mockResolvedValueOnce({data: CommonTestData.expectedGigyaResponseInvalidAPI})
        const response = await social.copy("targetApiKey",targetDataCenter)

        CommonTestData.verifyResponseIsNotOk(response, CommonTestData.expectedGigyaResponseInvalidAPI)
        expect(response.id).toEqual('Social;targetApiKey')
    })

    test('copy socials - invalid user key', async()=>{
        axios.mockResolvedValueOnce({data: SocialsTestData.getSocialsResponse})
            .mockResolvedValueOnce({data: CommonTestData.expectedGigyaInvalidUserKey})
        const response = await social.copy("targetApiKey",targetDataCenter)

        CommonTestData.verifyResponseIsNotOk(response, CommonTestData.expectedGigyaInvalidUserKey)
        expect(response.id).toEqual('Social;targetApiKey')
    })

    test('copy unsuccessfully - error on get', async () => {
        axios.mockResolvedValueOnce({ data: CommonTestData.expectedGigyaResponseInvalidAPI })
        const response = await social.copy('targetApiKey',targetDataCenter)

        CommonTestData.verifyResponseIsNotOk(response, CommonTestData.expectedGigyaResponseInvalidAPI)
    })
})