import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookApiUserApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'

import { mock } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookApiUserApi = mock<LoadFacebookApiUserApi>()

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookApiUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookApiUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookApiUserApi = mock<LoadFacebookApiUserApi>()

    loadFacebookApiUserApi.loadUser.mockResolvedValueOnce(undefined)

    const sut = new FacebookAuthenticationService(loadFacebookApiUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
