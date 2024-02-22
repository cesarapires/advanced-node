import { Facebook } from '@/infraestructure/gateways'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makefacebook = (): Facebook => {
  const axiosClient = makeAxiosHttpClient()

  return new Facebook(axiosClient, env.facebook.clientId, env.facebook.clientSecret)
}
