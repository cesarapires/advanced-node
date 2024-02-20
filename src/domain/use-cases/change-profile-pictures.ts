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
    let pictureUrl: string | undefined
    let initials: string | undefined
    if (file !== undefined) {
      const { uniqueId } = await this.crypto.generate({ id })
      const { url } = await this.uploadFile.upload({ key: uniqueId, file: file })
      pictureUrl = url
    } else {
      const userProfile = await this.userProfileRepository.load({ id })
      if (userProfile.name !== undefined) {
        const firstLetters = userProfile.name.match(/\b(.)/g) ?? []
        if (firstLetters.length > 1) {
          initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ''}`
        } else {
          initials = userProfile.name.substring(0, 2).toUpperCase()
        }
      }
    }
    await this.userProfileRepository.savePicture({ pictureUrl, initials })
  }
}

namespace ChangeProfilePicture {
  export type Params = {
    id: string
    file?: Buffer
  }
  export type Result = Promise<void>
}
