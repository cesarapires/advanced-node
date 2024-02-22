import { SaveUserProfile } from '@/domain/contracts/repositories'
import { PostgresUserAccount } from '@/infraestructure/repositories/postgres/entities'

import { getRepository } from 'typeorm'

type ParamsLoad = SaveUserProfile.Params

export class PostregresUserProfileRepository implements SaveUserProfile {
  async savePicture (params: ParamsLoad): Promise<void> {
    const { id, pictureUrl, initials } = params
    const postgresUserRepository = getRepository(PostgresUserAccount)
    await postgresUserRepository.update({ id: parseInt(id) }, { pictureUrl, initials })
  }
}
