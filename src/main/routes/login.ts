import { Router } from 'express'
import { makeFacebookLoginController } from '@/main/factories/controllers'
import { adaptExpressRoute } from '@/infraestructure/http'

export default (router: Router): void => {
  const controller = makeFacebookLoginController()

  router.post('/api/login/facebook', adaptExpressRoute(controller))
}
