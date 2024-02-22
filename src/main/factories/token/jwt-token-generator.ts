import { JwtTokenHandler } from '@/infraestructure/gateways/token'
import { env } from '@/main/config/env'

export const makeJwtTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret)
}
