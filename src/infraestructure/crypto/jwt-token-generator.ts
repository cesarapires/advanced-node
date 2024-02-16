import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
import { sign, verify } from 'jsonwebtoken'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async validateToken (params: TokenValidator.Params): Promise<void> {
    const { token } = params
    verify(token, this.secret)
  }

  async generateToken (params: Params): Promise<Result> {
    const { expirationInMs, key } = params
    const expiresInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expiresInSeconds })
  }
}
