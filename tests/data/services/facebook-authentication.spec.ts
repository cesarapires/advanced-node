import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookApiUserApi: LoadFacebookApiUserApi
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookApiUserApi.loadUser(params)
  }
}

interface LoadFacebookApiUserApi {
  loadUser: (params: LoadFacebookApiUserApi.Params) => Promise<void>
}

namespace LoadFacebookApiUserApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookApiUserApiSpy implements LoadFacebookApiUserApi {
  token?: string

  async loadUser (params: LoadFacebookApiUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApiUserApi = new LoadFacebookApiUserApiSpy()

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookApiUserApi.token).toBe('any_token')
  })
})
