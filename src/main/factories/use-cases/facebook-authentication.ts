import { FacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/api'
import { makePostregresUserAccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const userAccountRepository = makePostregresUserAccountRepository()

  const facebookApi = makeFacebookApi()

  const crypto = makeJwtTokenHandler()

  return new FacebookAuthentication(facebookApi, userAccountRepository, crypto)
}
