import { HttpGetClient } from '@/infraestructure/http'
import { LoadFacebookUserApi } from '@/data/contracts/api'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type FacebookUser = {
  id: string
  name: string
  email: string
}

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    let userFacebook: FacebookUser

    try {
      userFacebook = await this.getFacebookUser(params.token)
    } catch {
      return undefined
    }

    return {
      facebookId: userFacebook.id,
      name: userFacebook.name,
      email: userFacebook.email
    }
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()

    return this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getFacebookUser (clientToken: string): Promise<FacebookUser> {
    const debugToken = await this.getDebugToken(clientToken)

    return this.httpGetClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }
}
