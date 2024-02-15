import { TokenGenerator } from '@/data/contracts/crypto'
import { sign } from 'jsonwebtoken'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: Params): Promise<Result> {
    const { expirationInMs, key } = params

    const expiresInSeconds = expirationInMs / 1000

    return sign({ key }, this.secret, { expiresIn: expiresInSeconds })
  }
}
