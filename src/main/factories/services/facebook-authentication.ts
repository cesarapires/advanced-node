import { FacebookAuthenticationService } from '@/domain/services'
import { makeFacebookApi } from '@/main/factories/api'
import { makePostregresUserAccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const userAccountRepository = makePostregresUserAccountRepository()

  const facebookApi = makeFacebookApi()

  const crypto = makeJwtTokenGenerator()

  return new FacebookAuthenticationService(facebookApi, userAccountRepository, crypto)
}
