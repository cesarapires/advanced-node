import { mock, MockProxy } from 'jest-mock-extended'

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}

export namespace TokenValidator {
  export type Params = {
    token: string
  }

  export type Result = string
}

export class Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async perform (token: string): Promise<string> {
    return await this.crypto.validateToken({ token: token })
  }
}

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
