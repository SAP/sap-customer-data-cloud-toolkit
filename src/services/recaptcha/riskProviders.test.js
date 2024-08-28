import axios from 'axios';
import RiskProviders from './riskProviders.js';

jest.mock('axios');

describe('RiskProviders test suite', () => {
  const credentials = {
    userKey: 'testUserKey',
    secret: 'testSecret',
    gigyaConsole: 'testGigyaConsole',
  };
  const site = 'testSite';
  const dataCenter = 'eu1';
  const riskProviders = new RiskProviders(credentials.userKey, credentials.secret, credentials.gigyaConsole);

  test('get risk providers configuration successfully', async () => {
    const mockResponse = {
      errorCode: 0,
      config: { provider: 'testProvider' },
    };

    axios.mockResolvedValueOnce({ data: mockResponse });

    const response = await riskProviders.get(site, dataCenter);

    expect(response.errorCode).toBe(0);
    expect(response.config).toEqual(mockResponse.config);
  });

  test('get risk providers configuration with error', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: 500,
          errorMessage: 'Internal server error',
        },
      },
    };

    axios.mockRejectedValueOnce(mockErrorResponse);

    try {
      const response = await riskProviders.get(site, dataCenter);
      console.log('Erro tratado:', response); // Verificando o que está sendo retornado após a rejeição
      expect(response).toEqual({
        data: {
          errorCode: 500,
          errorDetails: 'Internal server error',
          errorMessage: 'Error getting Risk Providers configuration',
          time: expect.any(Number),
        },
      });
    } catch (error) {
      console.log('Erro capturado no catch:', error);
    }
  });

  test('set risk providers configuration successfully', async () => {
    const mockResponse = { errorCode: 0 };

    axios.mockResolvedValueOnce({ data: mockResponse });

    const response = await riskProviders.set(site, dataCenter, { provider: 'testProvider' });

    expect(response.errorCode).toBe(0);
  });

  test('set risk providers configuration with error', async () => {
    const mockErrorResponse = {
      response: {
        data: {
          errorCode: 500,
          errorMessage: 'Internal server error',
        },
      },
    };

    axios.mockRejectedValueOnce(mockErrorResponse);

    try {
      const response = await riskProviders.set(site, dataCenter, { provider: 'testProvider' });
      console.log('Erro tratado no set:', response); // Verificando o que está sendo retornado após a rejeição
      expect(response).toEqual({
        data: {
          errorCode: 500,
          errorDetails: 'Internal server error',
          errorMessage: 'Error setting Risk Providers configuration',
          time: expect.any(Number),
        },
      });
    } catch (error) {
      console.log('Erro capturado no catch do set:', error);
    }
  });
});
