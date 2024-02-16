import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repository'
import { PostgresUserAccount } from '@/infraestructure/postgres/entities'

import { getRepository } from 'typeorm'

type ParamsLoad = LoadUserAccountRepository.Params
type ResultLoad = LoadUserAccountRepository.Result

type ParamsSave = SaveFacebookAccountRepository.Params
type ResultSave = SaveFacebookAccountRepository.Result

export class PostregresUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load (params: ParamsLoad): Promise<ResultLoad> {
    const postgresUserRepository = getRepository(PostgresUserAccount)

    const { email } = params

    const postgresUser = await postgresUserRepository.findOne({ email: email })

    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser?.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: ParamsSave): Promise<ResultSave> {
    const { id } = params

    let resultId: string

    if (id === undefined) {
      const acccount = await this.saveAccount(params)
      resultId = acccount.id.toString()
    } else {
      await this.updateAccount(params)
      resultId = id
    }

    return {
      id: resultId ?? id
    }
  }

  private async saveAccount (params: ParamsSave): Promise<PostgresUserAccount> {
    const postgresUserRepository = getRepository(PostgresUserAccount)

    const { name, email, facebookId } = params

    return postgresUserRepository.save({
      name: name,
      email: email,
      facebookId: facebookId
    })
  }

  private async updateAccount (params: ParamsSave): Promise<void> {
    const postgresUserRepository = getRepository(PostgresUserAccount)

    const { id, name, facebookId } = params

    if (id !== undefined) {
      await postgresUserRepository.update({
        id: parseInt(id)
      }, {
        name: name,
        facebookId: facebookId
      })
    }
  }
}
