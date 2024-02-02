import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookApiUser } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookApiUser: MockProxy<LoadFacebookApiUser>
}

const makeSut = (): SutTypes => {
  const loadFacebookApiUser = mock<LoadFacebookApiUser>()

  const sut = new FacebookAuthenticationService(loadFacebookApiUser)

  return {
    sut,
    loadFacebookApiUser
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUser with correct params', async () => {
    const { sut, loadFacebookApiUser } = makeSut()

    await sut.perform({ token: 'any_token' })

    expect(loadFacebookApiUser.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookApiUser.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUser returns undefined', async () => {
    const { sut, loadFacebookApiUser } = makeSut()

    loadFacebookApiUser.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
