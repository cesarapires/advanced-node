import { Controller } from '@/application/controllers'

import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (request, response) => {
  const { statusCode, data } = await controller.handle({ ...request.body, ...request.locals })
  const json = statusCode === 200 ? data : { error: data.message }
  response.status(statusCode).json(json)
}
