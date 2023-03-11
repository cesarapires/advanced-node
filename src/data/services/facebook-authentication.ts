import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentican } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async perform (params: FacebookAuthentican.Params): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}
