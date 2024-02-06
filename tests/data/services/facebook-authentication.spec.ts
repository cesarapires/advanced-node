import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import { FacebookAuthenticationService } from '@/data/services'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repository'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthenticationService
  const token = {
    token: 'any_token'
  }

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })

    crypto = mock()

    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform(token)

    expect(facebookApi.loadUser).toHaveBeenCalledWith(token)
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform(token)

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform(token)

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))

    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform(token)

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform(token)

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})
