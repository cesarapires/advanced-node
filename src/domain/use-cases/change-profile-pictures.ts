import { UserProfile } from '@/domain/models'
import { DeleteFile, UploadFile } from '@/domain/contracts/gateway'
import { UniqueIdGenerator } from '@/domain/contracts/crypto'
import { SaveUserProfile, LoadUserProfile } from '@/domain/contracts/repository'

type Params = ChangeProfilePicture.Params
type Result = ChangeProfilePicture.Result

export class ChangeProfilePicture {
  constructor (
    private readonly uploadFile: UploadFile & DeleteFile,
    private readonly crypto: UniqueIdGenerator,
    private readonly userProfileRepository: SaveUserProfile & LoadUserProfile
  ) {}

  async perform (params: Params): Promise<Result> {
    const { id, file } = params
    const { uniqueId } = await this.crypto.generate({ id })
    const data = {
      pictureUrl: file !== undefined ? await this.getUrlFile(file, uniqueId) : undefined,
      name: file === undefined ? await this.getNameProfile(params) : undefined
    }
    const userProfile = new UserProfile(id)
    userProfile.setPicture(data)
    try {
      await this.userProfileRepository.savePicture(userProfile)
    } catch {
      if (file !== undefined) await this.uploadFile.delete({ key: uniqueId })
      throw new Error('teste')
    }
    return userProfile
  }

  private async getUrlFile (file: Buffer, uniqueId: string): Promise<string | undefined> {
    const { url } = await this.uploadFile.upload({ key: uniqueId, file: file })
    return url
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
