import { Authorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '@/main/factories/infraestructure/gateways/token'

export const makeAuthorize = (): Authorize => {
  return new Authorize(makeJwtTokenHandler())
}
