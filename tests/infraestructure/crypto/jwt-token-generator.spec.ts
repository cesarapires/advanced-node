import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expiresInSeconds = params.expirationInMs / 1000

    return jwt.sign({ key: params.key }, this.secret, { expiresIn: expiresInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key: 'any_token', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_token' }, 'any_secret', { expiresIn: 1 })
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({ key: 'any_token', expirationInMs: 1000 })

    expect(token).toEqual('any_token')
  })
})
