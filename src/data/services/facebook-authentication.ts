import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookApiUser } from '@/data/contracts/api'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookApiUser: LoadFacebookApiUser
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookApiUser.loadUser(params)

    return new AuthenticationError()
  }
}
