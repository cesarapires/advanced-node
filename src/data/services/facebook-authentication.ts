import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/contracts/repository'

export class FacebookAuthenticationService {
  constructor (
    private readonly LoadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.LoadFacebookUserApi.loadUser(params)

    if (facebookData !== undefined) {
      await this.loadUserAccountRepository.load({ email: facebookData.email })

      await this.createFacebookAccountRepository.createFromFacebook(facebookData)
    }

    return new AuthenticationError()
  }
}
