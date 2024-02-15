import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'
import login from '@/main/routes/login'

export const setupRoutes = (express: Express): void => {
  const router = Router()

  readdirSync(join(__dirname, '../routes'))
    .filter(file => !file.endsWith('.map'))
    .map(async file => {
      (await import(`../routes/${file}`))
    })

  login(router)

  express.use('/api', router)
}
