import { env } from '@/main/config/env'
import { FacebookApi } from '@/infraestructure/apis'
import { AxiosHttpClient } from '@/infraestructure/http'

describe('FacebookApiIntegrationTest', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const userFacebook = await sut.loadUser({ token: 'EAAk0ZCdCSSoMBO6xZCWF8dCHHYlSVlHabKnHykAlmbOUIyYNOfRy6hoGeBBg772rwy4u0ojLRLJwzm6PFLl1SFTEfr6kStKnwGKy8v70p6V2QhUQpZC03A6cer7k3rm8yd2jrYtJCUZBB9IaZCazLXDjJHtwi6eXOxHoTJkKOfy02ZCjBwf7b9ZCTeAjZBLgyxiJ1RTk4y3PpDrQZAUbq248KNrz4iTsjiVTFvKndCvNMCCVdpqOchGm3A5XGPQeZAWQZDZD' })

    expect(userFacebook).toEqual({
      facebookId: '7335011393227383',
      name: 'César Pires',
      email: undefined
    })
  })

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const userFacebook = await sut.loadUser({ token: 'invalid' })

    expect(userFacebook).toBeUndefined()
  })
})
