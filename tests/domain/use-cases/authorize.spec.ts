import { Authorize } from '@/domain/use-cases'
import { TokenValidator } from '@/domain/contracts/crypto'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  const token = {
    token: 'any_token'
  }

  beforeAll(() => {
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_user_id')
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new Authorize(crypto)
  })

  it('should call TokenValidator with correct params', async () => {
    await sut.perform('any_token')

    expect(crypto.validateToken).toHaveBeenCalledWith(token)
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('should return the correct accessToken', async () => {
    const userId = await sut.perform('any_token')

    expect(userId).toBe('any_user_id')
  })
})
