import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = {
    token: 'any_token'
  }

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepository = mock()
    createFacebookAccountRepository = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createFacebookAccountRepository
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform(token)

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(token)
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform(token)

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform(token)

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)

    await sut.perform(token)

    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
