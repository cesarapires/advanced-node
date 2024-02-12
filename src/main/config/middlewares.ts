import { Express, json } from 'express'
import cors from 'cors'

export const setupMiddlewares = (express: Express): void => {
  express.use(cors())
  express.use(json())
  express.use((request, response, next) => {
    response.type('json')
    next()
  })
}
