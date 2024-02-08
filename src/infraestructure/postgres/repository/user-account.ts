import { LoadUserAccountRepository } from '@/data/contracts/repository'
import { PostgresUserAccount } from '@/infraestructure/postgres/entities'

import { getRepository } from 'typeorm'

export class PostregresUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const postreUserRepository = getRepository(PostgresUserAccount)
    const postgresUser = await postreUserRepository.findOne({ email: params.email })

    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser?.name ?? undefined
      }
    }
  }
}
