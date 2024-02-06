import { LoadFacebookUserApi } from '@/data/contracts/api'
import { MockProxy, mock } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com/'

  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({
      url: `${this.baseUrl}oauth/access_token`,
      params: {
        client_url: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
    params: {
      client_url: string
      client_secret: string
      grant_type: string
    }
  }
}

describe('FabookApi', () => {
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>
  let clientId: string
  let clientSecret: string

  beforeAll(() => {
    clientId = 'any_client_any'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_url: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })
})
