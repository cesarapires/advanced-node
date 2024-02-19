import { FacebookAuthentication } from '@/domain/use-cases'
import { makefacebook } from '@/main/factories/api'
import { makePostregresUserAccountRepository } from '@/main/factories/repositories'
import { makeJwtTokenHandler } from '@/main/factories/token'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const userAccountRepository = makePostregresUserAccountRepository()

  const facebook = makefacebook()

  const token = makeJwtTokenHandler()

  return new FacebookAuthentication(facebook, userAccountRepository, token)
}
