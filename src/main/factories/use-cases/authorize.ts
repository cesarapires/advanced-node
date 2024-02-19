import { Authorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '../crypto'

export const makeAuthorize = (): Authorize => {
  return new Authorize(makeJwtTokenHandler())
}
