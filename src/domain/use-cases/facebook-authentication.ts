import { AuthenticationError } from '@/domain/models/errors'
import { TokenGenerator } from '@/domain/contracts/crypto'
import { LoadFacebookUserApi } from '@/domain/contracts/api'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repository'
import { AccessToken, FacebookAccount } from '@/domain/models'

type Params = {token: string}
type Result = { accessToken: string } | AuthenticationError

export class FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: Params): Promise<Result> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })
      const facebookAccount = new FacebookAccount(facebookData, accountData)
      const userAccount = await this.userAccountRepository.saveWithFacebook(facebookAccount)
      const token = await this.crypto.generateToken({
        key: userAccount.id,
        expirationInMs: AccessToken.expirationInMs
      })
      return { accessToken: token }
    }

    throw new AuthenticationError()
  }
}
