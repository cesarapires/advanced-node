import { Authorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '../token'

export const makeAuthorize = (): Authorize => {
  return new Authorize(makeJwtTokenHandler())
}
