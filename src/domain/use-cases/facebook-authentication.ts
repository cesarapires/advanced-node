import { AuthenticationError } from '@/domain/models/errors'
import { TokenGenerator } from '@/domain/contracts/token'
import { LoadFacebookUser } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repository'
import { AccessToken, FacebookAccount } from '@/domain/models'

type Params = {token: string}
type Result = { accessToken: string } | AuthenticationError

export class FacebookAuthentication {
  constructor (
    private readonly facebook: LoadFacebookUser,
    private readonly userAccountRepository: LoadUserAccount & SaveFacebookAccount,
    private readonly token: TokenGenerator
  ) {}

  async perform (params: Params): Promise<Result> {
    const facebookData = await this.facebook.loadUser(params)

    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })
      const facebookAccount = new FacebookAccount(facebookData, accountData)
      const userAccount = await this.userAccountRepository.saveWithFacebook(facebookAccount)
      const token = await this.token.generateToken({
        key: userAccount.id,
        expirationInMs: AccessToken.expirationInMs
      })
      return { accessToken: token }
    }

    throw new AuthenticationError()
  }
}
