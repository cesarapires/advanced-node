import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

type ParamsGenerator = TokenGenerator.Params
type ResultGenerator = TokenGenerator.Result

type ParamsValidate = TokenValidator.Params
type ResultValidate = TokenValidator.Result

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}

  async validateToken (params: ParamsValidate): Promise<ResultValidate> {
    const { token } = params
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }

  async generateToken (params: ParamsGenerator): Promise<ResultGenerator> {
    const { expirationInMs, key } = params
    const expiresInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expiresInSeconds })
  }
}
