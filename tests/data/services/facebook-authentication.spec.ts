import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookApiUserApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'

class LoadFacebookApiUserApiSpy implements LoadFacebookApiUserApi {
  token?: string
  callsCount = 0
  result = undefined

  async loadUser (params: LoadFacebookApiUserApi.Params): Promise<LoadFacebookApiUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApiUserApi = new LoadFacebookApiUserApiSpy()

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookApiUserApi.token).toBe('any_token')
    expect(loadFacebookApiUserApi.callsCount).toBe(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookApiUserApi = new LoadFacebookApiUserApiSpy()
    loadFacebookApiUserApi.result = undefined

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
