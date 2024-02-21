import { UserProfile } from '@/domain/models'
import { UploadFile } from '@/domain/contracts/gateway'
import { UniqueIdGenerator } from '@/domain/contracts/crypto'
import { SaveUserProfile, LoadUserProfile } from '@/domain/contracts/repository'

type Params = ChangeProfilePicture.Params
type Result = ChangeProfilePicture.Result

export class ChangeProfilePicture {
  constructor (
    private readonly uploadFile: UploadFile,
    private readonly crypto: UniqueIdGenerator,
    private readonly userProfileRepository: SaveUserProfile & LoadUserProfile
  ) {}

  async perform (params: Params): Result {
    const { id, file } = params
    const data: {pictureUrl?: string, name?: string} = {}
    if (file !== undefined) {
      const { uniqueId } = await this.crypto.generate({ id })
      const { url } = await this.uploadFile.upload({ key: uniqueId, file: file })
      data.pictureUrl = url
    } else {
      data.name = (await this.userProfileRepository.load({ id })).name
    }
    const userProfile = new UserProfile(id)
    userProfile.setPicture(data)
    await this.userProfileRepository.savePicture(userProfile)
  }
}

namespace ChangeProfilePicture {
  export type Params = {
    id: string
    file?: Buffer
  }
  export type Result = Promise<void>
}
