import { env } from '@/main/config/env'
import { FacebookApi } from '@/infraestructure/apis'
import { AxiosHttpClient } from '@/infraestructure/http'

describe('FacebookApiIntegrationTest', () => {
  let sut: FacebookApi

  beforeEach(() => {
    const axiosClient = new AxiosHttpClient()

    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('should return a Facebook User if token is valid', async () => {
    const userFacebook = await sut.loadUser({ token: env.facebookApi.accessToken })

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
