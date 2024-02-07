import { HttpGetClient } from '@/infraestructure/http'
import { LoadFacebookUserApi } from '@/data/contracts/api'

export class FacebookApi {
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
