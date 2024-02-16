import { TokenValidator } from '@/domain/contracts/crypto'

export class Authorize {
  constructor (private readonly crypto: TokenValidator) {}

  async perform (token: string): Promise<string> {
    return this.crypto.validateToken({ token: token })
  }
}
