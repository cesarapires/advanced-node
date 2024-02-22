import { env } from '@/main/config/env'
import { Facebook } from '@/infraestructure/gateways'
import { AxiosHttpClient } from '@/infraestructure/http'

describe('facebookIntegrationTest', () => {
  let sut: Facebook

  beforeEach(() => {
    const axiosClient = new AxiosHttpClient()

    sut = new Facebook(
      axiosClient,
      env.facebook.clientId,
      env.facebook.clientSecret
    )
  })

  it('should return a Facebook User if token is valid', async () => {
    const userFacebook = await sut.loadUser({ token: env.facebook.accessToken })

    expect(userFacebook).toEqual({
      facebookId: '7335011393227383',
      name: 'César Pires',
      email: undefined
    })
  })

  it('should return undefined if token is invalid', async () => {
    const userFacebook = await sut.loadUser({ token: 'invalid' })

    expect(userFacebook).toBeUndefined()
  })
})
