import { Authorize } from '@/domain/use-cases'
import { TokenValidator } from '@/domain/contracts/gateways/token'

import { mock, MockProxy } from 'jest-mock-extended'

describe('Authorize', () => {
  let token: MockProxy<TokenValidator>
  let sut: Authorize
  const anyToken = {
    token: 'any_token'
  }

  beforeAll(() => {
    token = mock()
    token.validateToken.mockResolvedValue('any_user_id')
  })

  beforeEach(() => {
    jest.clearAllMocks()

    sut = new Authorize(token)
  })

  it('should call TokenValidator with correct params', async () => {
    await sut.perform(anyToken)

    expect(token.validateToken).toHaveBeenCalledWith(anyToken)
    expect(token.validateToken).toHaveBeenCalledTimes(1)
  })

  it('should return the correct accessToken', async () => {
    const userId = await sut.perform(anyToken)

    expect(userId).toBe('any_user_id')
  })
})
