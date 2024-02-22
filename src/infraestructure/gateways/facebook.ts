import { HttpGetClient } from '@/infraestructure/http'
import { LoadFacebookUser } from '@/domain/contracts/gateways'

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

type Params = LoadFacebookUser.Params
type Result = LoadFacebookUser.Result

export class Facebook implements LoadFacebookUser {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: Params): Promise<Result> {
    const { token } = params

    let userFacebook: FacebookUser

    try {
      userFacebook = await this.getFacebookUser(token)
    } catch {
      return undefined
    }

    return {
      facebookId: userFacebook.id,
      name: userFacebook.name,
      email: userFacebook.email ?? 'teste@hotmail.com'
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
