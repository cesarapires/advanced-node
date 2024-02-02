import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookApiUser } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookApiUser: MockProxy<LoadFacebookApiUser>
  let sut: FacebookAuthenticationService
  const token = {
    token: 'any_token'
  }

  beforeEach(() => {
    loadFacebookApiUser = mock()
    sut = new FacebookAuthenticationService(loadFacebookApiUser)
  })

  it('should call LoadFacebookUser with correct params', async () => {
    await sut.perform(token)

    expect(loadFacebookApiUser.loadUser).toHaveBeenCalledWith(token)
    expect(loadFacebookApiUser.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUser returns undefined', async () => {
    loadFacebookApiUser.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform(token)

    expect(authResult).toEqual(new AuthenticationError())
  })
})
