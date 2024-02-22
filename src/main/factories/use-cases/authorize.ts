import { Authorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '@/main/factories/token'

export const makeAuthorize = (): Authorize => {
  return new Authorize(makeJwtTokenHandler())
}
