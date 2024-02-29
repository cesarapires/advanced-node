import { UserProfile } from '@/domain/models'
import { DeleteFile, UploadFile } from '@/domain/contracts/gateways/file-storage'
import { UniqueIdGenerator } from '@/domain/contracts/gateways/crypto'
import { SaveUserProfile, LoadUserProfile } from '@/domain/contracts/repositories'
import { FileProps } from '@/domain/models/file-props'

type Params = ChangeProfilePicture.Params
type Result = ChangeProfilePicture.Result

export class ChangeProfilePicture {
  private readonly pathFile = 'private/user/profile'

  constructor (
    private readonly uploadFile: UploadFile & DeleteFile,
    private readonly crypto: UniqueIdGenerator,
    private readonly userProfileRepository: SaveUserProfile & LoadUserProfile
  ) { }

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
    } catch (error) {
      if (file !== undefined) await this.uploadFile.delete({ fileName: uniqueId })
      throw error
    }
    return {
      pictureUrl: userProfile.pictureUrl,
      initials: userProfile.initials
    }
  }

  private async getUrlFile (file: FileProps, uniqueId: string): Promise<string | undefined> {
    if (file !== undefined) {
      const fileName = `${this.pathFile}/${uniqueId}.${file.mimeType.split('/')[1]}`
      const { url } = await this.uploadFile.upload({ fileName, file: file.buffer })
      return url
    }
  }

  private async getNameProfile (params: Params): Promise<string | undefined> {
    const { id } = params
    return (await this.userProfileRepository.load({ id }))?.name
  }
}

namespace ChangeProfilePicture {
  export type Params = {
    id: string
    file?: FileProps

  }
  export type Result = {
    pictureUrl?: string
    initials?: string
  }
}
