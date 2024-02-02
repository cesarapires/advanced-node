import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookApiUserApi: LoadFacebookApiUserApi
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadFacebookApiUserApi.loadUser(params)

    return new AuthenticationError()
  }
}

interface LoadFacebookApiUserApi {
  loadUser: (params: LoadFacebookApiUserApi.Params) => Promise<LoadFacebookApiUserApi.Result>
}

namespace LoadFacebookApiUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}

class LoadFacebookApiUserApiSpy implements LoadFacebookApiUserApi {
  token?: string
  result = undefined

  async loadUser (params: LoadFacebookApiUserApi.Params): Promise<LoadFacebookApiUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApiUserApi = new LoadFacebookApiUserApiSpy()

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookApiUserApi.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookApiUserApi = new LoadFacebookApiUserApiSpy()
    loadFacebookApiUserApi.result = undefined

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
