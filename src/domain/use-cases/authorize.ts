import { TokenValidator } from '@/domain/contracts/crypto'

type Params = {token: string}
type Result = string

export class Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async perform (params: Params): Promise<Result> {
    return this.crypto.validateToken(params)
  }
}
