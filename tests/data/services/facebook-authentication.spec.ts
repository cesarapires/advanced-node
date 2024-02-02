import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApiUserApi = {
      loadUser: jest.fn()
    }

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookApiUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookApiUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookApiUserApi = {
      loadUser: jest.fn()
    }

    loadFacebookApiUserApi.loadUser.mockResolvedValueOnce(undefined)

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
