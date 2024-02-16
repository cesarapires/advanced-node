import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '@/main/factories/use-cases'

export const makeFacebookLoginController = (): FacebookLoginController => {
  const FacebookAuthentication = makeFacebookAuthentication()

  return new FacebookLoginController(FacebookAuthentication)
}
