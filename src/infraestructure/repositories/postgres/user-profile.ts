import { LoadUserProfile, SaveUserProfile } from '@/domain/contracts/repositories'
import { PostgresUserAccount } from '@/infraestructure/repositories/postgres/entities'

import { getRepository } from 'typeorm'

type ParamsSaveUserProfile = SaveUserProfile.Params

type ParamsLoad = LoadUserProfile.Params
type ResultLoad = LoadUserProfile.Result

export class PostregresUserProfileRepository implements SaveUserProfile, LoadUserProfile {
  async savePicture (params: ParamsSaveUserProfile): Promise<void> {
    const { id, pictureUrl, initials } = params
    const postgresUserRepository = getRepository(PostgresUserAccount)
    await postgresUserRepository.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  async load (params: ParamsLoad): Promise<ResultLoad> {
    const { id } = params
    const postgresUserRepository = getRepository(PostgresUserAccount)
    const postresUser = await postgresUserRepository.findOne({ id: parseInt(id) })
    if (postresUser !== undefined) return { name: postresUser.name ?? undefined }
  }
}
