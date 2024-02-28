import { FacebookAuthentication } from '@/domain/use-cases'
import { makefacebook } from '@/main/factories/infraestructure/gateways/facebook'
import { makePostregresUserAccountRepository } from '@/main/factories/infraestructure/repositories/postgres'
import { makeJwtTokenHandler } from '@/main/factories/infraestructure/gateways/token'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const userAccountRepository = makePostregresUserAccountRepository()

  const facebook = makefacebook()

  const token = makeJwtTokenHandler()

  return new FacebookAuthentication(facebook, userAccountRepository, token)
}
