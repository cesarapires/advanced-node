import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookApiUser } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookApiUser: LoadFacebookApiUser,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookApiUser.loadUser(params)

    if (facebookData !== undefined) {
      await this.loadUserAccountRepository.load({ email: facebookData.email })
    }

    return new AuthenticationError()
  }
}
