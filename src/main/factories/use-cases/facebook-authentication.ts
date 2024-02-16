import { FacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/api'
import { makePostregresUserAccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const userAccountRepository = makePostregresUserAccountRepository()

  const facebookApi = makeFacebookApi()

  const crypto = makeJwtTokenGenerator()

  return new FacebookAuthentication(facebookApi, userAccountRepository, crypto)
}
