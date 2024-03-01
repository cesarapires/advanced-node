import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { adaptExpressRoute, adaptMulter } from '@/main/adapters'
import { makeDeleteProfileController, makeSaveProfileController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  const controllerPut = makeSaveProfileController()
  const controllerDelete = makeDeleteProfileController()

  router.put('/users/picture', auth, adaptMulter, adaptExpressRoute(controllerPut))
  router.delete('/users/picture', auth, adaptExpressRoute(controllerDelete))
}
