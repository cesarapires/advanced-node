import { PostgresUserAccount } from '@/infraestructure/postgres/entities'
import { SaveFacebookAccountRepository } from '@/data/contracts/repository'

import { getRepository } from 'typeorm'

export class PostgresSaveUserAccountFacebookRepository implements SaveFacebookAccountRepository {
  private readonly postgresUserRepository = getRepository(PostgresUserAccount)

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    let resultId: string

    if (params.id === undefined) {
      const acccount = await this.saveAccount(params)
      resultId = acccount.id.toString()
    } else {
      await this.updateAccount(params)
      resultId = params.id
    }

    return {
      id: resultId ?? params.id
    }
  }

  private async saveAccount (params: SaveFacebookAccountRepository.Params): Promise<PostgresUserAccount> {
    const { name, email, facebookId } = params

    return this.postgresUserRepository.save({
      name: name,
      email: email,
      facebookId: facebookId
    })
  }

  private async updateAccount (params: SaveFacebookAccountRepository.Params): Promise<void> {
    const { id, name, facebookId } = params
    if (id !== undefined) {
      await this.postgresUserRepository.update({
        id: parseInt(id)
      }, {
        name: name,
        facebookId: facebookId
      })
    }
  }
}
