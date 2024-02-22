import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/domain/contracts/token'
import { AuthenticationError } from '@/domain/models/errors'
import { LoadFacebookUser } from '@/domain/contracts/gateways'
import { FacebookAuthentication } from '@/domain/use-cases'
import { SaveFacebookAccount, LoadUserAccount } from '@/domain/contracts/repository'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthentication', () => {
  let facebook: MockProxy<LoadFacebookUser>
  let userAccountRepository: MockProxy<LoadUserAccount & SaveFacebookAccount>
  let token: MockProxy<TokenGenerator>
  let sut: FacebookAuthentication
  const anyToken = {
    token: 'any_token'
  }

  beforeAll(() => {
    facebook = mock()
    facebook.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })

    token = mock()
    token.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new FacebookAuthentication(
      facebook,
      userAccountRepository,
      token
    )
  })

  it('should call LoadFacebookUser with correct params', async () => {
    await sut.perform(anyToken)

    expect(facebook.loadUser).toHaveBeenCalledWith(anyToken)
    expect(facebook.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebook.loadUser.mockResolvedValueOnce(undefined)

    const authResult = sut.perform(anyToken)

    await expect(authResult).rejects.toThrow(new AuthenticationError())
  })

  it('should call LoadUserAccount when LoadFacebookUser returns data', async () => {
    await sut.perform(anyToken)

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccount with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform(anyToken)

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform(anyToken)

    expect(token.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(token.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.perform(anyToken)

    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  it('should rethrow if LoadFacebookUser throws', async () => {
    facebook.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.perform(anyToken)

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if LoadUserAccount throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_user_error'))

    const promise = sut.perform(anyToken)

    await expect(promise).rejects.toThrow(new Error('load_user_error'))
  })

  it('should rethrow if SaveFacebookAccount throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_user_error'))

    const promise = sut.perform(anyToken)

    await expect(promise).rejects.toThrow(new Error('save_user_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    token.generateToken.mockRejectedValueOnce(new Error('generate_token_error'))

    const promise = sut.perform(anyToken)

    await expect(promise).rejects.toThrow(new Error('generate_token_error'))
  })
})
