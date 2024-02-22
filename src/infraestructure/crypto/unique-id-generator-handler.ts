import { UniqueIdGenerator } from '@/domain/contracts/crypto'

import { v4 } from 'uuid'

export class UniqueIdGeneratorHandler implements UniqueIdGenerator {
  async generate ({ id }: UniqueIdGenerator.Params): Promise<UniqueIdGenerator.Result> {
    return { uniqueId: `${v4()}_${id}` }
  }
}
