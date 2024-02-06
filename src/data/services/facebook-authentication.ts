import { AuthenticationError } from '@/domain/errors'
import { TokenGenerator } from '@/data/contracts/crypto'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { AccessToken, FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })

      const facebookAccount = new FacebookAccount(facebookData, accountData)

      const userAccount = await this.userAccountRepository.saveWithFacebook(facebookAccount)

      await this.crypto.generateToken({
        key: userAccount.id,
        expirationInMs: AccessToken.expirationInMs
      })
    }

    return new AuthenticationError()
  }
}
