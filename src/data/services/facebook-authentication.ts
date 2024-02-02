import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookApiUserApi } from '@/data/contracts/api'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookApiUserApi: LoadFacebookApiUserApi
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookApiUserApi.loadUser(params)

    return new AuthenticationError()
  }
}
