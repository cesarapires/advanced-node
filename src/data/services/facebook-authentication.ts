import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })

      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        email: facebookData.email,
        name: accountData?.name ?? facebookData.name,
        facebookId: facebookData.facebookId
      })
    }

    return new AuthenticationError()
  }
}
