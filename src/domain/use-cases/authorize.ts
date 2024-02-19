import { TokenValidator } from '@/domain/contracts/token'

type Params = {token: string}
type Result = string

export class Authorize {
  constructor (private readonly token: TokenValidator) {}

  async perform (params: Params): Promise<Result> {
    return this.token.validateToken(params)
  }
}
