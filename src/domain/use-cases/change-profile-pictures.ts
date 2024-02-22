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

  async perform (params: Params): Promise<Result> {
    const { id, file } = params
    const data = {
      pictureUrl: file !== undefined ? await this.getUrlFile(params) : undefined,
      name: file === undefined ? await this.getNameProfile(params) : undefined
    }
    const userProfile = new UserProfile(id)
    userProfile.setPicture(data)
    await this.userProfileRepository.savePicture(userProfile)
    return userProfile
  }

  private async getUrlFile (params: Params): Promise<string | undefined> {
    const { id, file } = params
    if (file !== undefined) {
      const { uniqueId } = await this.crypto.generate({ id })
      const { url } = await this.uploadFile.upload({ key: uniqueId, file: file })
      return url
    }
    return undefined
  }

  private async getNameProfile (params: Params): Promise<string | undefined> {
    const { id } = params
    const { name } = await this.userProfileRepository.load({ id })
    return name
  }
}

namespace ChangeProfilePicture {
  export type Params = {
    id: string
    file?: Buffer
  }
  export type Result = {
    pictureUrl?: string
    initials?: string
  }
}
