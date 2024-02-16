import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}

  async validateToken (params: TokenValidator.Params): Promise<string> {
    const { token } = params
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }

  async generateToken (params: Params): Promise<Result> {
    const { expirationInMs, key } = params
    const expiresInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expiresInSeconds })
  }
}
