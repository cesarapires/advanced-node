import { UniqueIdGeneratorHandler } from '@/infraestructure/gateways/crypto'

export const makeUniqueIdGeneratorHandler = (): UniqueIdGeneratorHandler => {
  return new UniqueIdGeneratorHandler()
}
