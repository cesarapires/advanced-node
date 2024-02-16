import { mock, MockProxy } from 'jest-mock-extended'

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}

export namespace TokenValidator {
  export type Params = {
    token: string
  }

  export type Result = boolean
}

export class Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async perform (token: string): Promise<void> {
    await this.crypto.validateToken({ token: token })
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
    crypto.validateToken.mockResolvedValue(true)
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
})
