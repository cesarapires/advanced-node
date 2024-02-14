import { JwtTokenGenerator } from '@/infraestructure/crypto'
import { env } from '@/main/config/env'

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  return new JwtTokenGenerator(env.jwtSecret)
}
