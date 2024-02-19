import { Facebook } from '@/infraestructure/apis'
import { HttpGetClient } from '@/infraestructure/http'

import { MockProxy, mock } from 'jest-mock-extended'

describe('FabookApi', () => {
  let sut: Facebook
  let httpClient: MockProxy<HttpGetClient>
  let clientId: string
  let clientSecret: string

  beforeAll(() => {
    clientId = 'any_client_any'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
      .mockResolvedValueOnce({
        id: 'any_fabook_id',
        name: 'any_facebook_name',
        email: 'any_facebook_email'
      })
    sut = new Facebook(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })

  it('should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })

  it('should return facebook user info', async () => {
    const facebookUser = await sut.loadUser({ token: 'any_client_token' })

    expect(facebookUser).toEqual({
      facebookId: 'any_fabook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email'
    })
  })

  it('should return undefined if HttpGetClient throws', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('facebook_api_generic_error'))

    const facebookUser = await sut.loadUser({ token: 'any_client_token' })

    expect(facebookUser).toBeUndefined()
  })
})
