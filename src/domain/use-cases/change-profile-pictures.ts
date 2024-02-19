import { UploadFile } from '@/domain/contracts/gateway'
import { UniqueIdGenerator } from '@/domain/contracts/crypto'
import { SaveUserPictures } from '@/domain/contracts/repository'

type Params = ChangeProfilePicture.Params
type Result = ChangeProfilePicture.Result

export class ChangeProfilePicture {
  constructor (
    private readonly uploadFile: UploadFile,
    private readonly crypto: UniqueIdGenerator,
    private readonly userProfileRepository: SaveUserPictures
  ) {}

  async perform (params: Params): Result {
    const { id, file } = params
    let pictureUrl: string | undefined
    if (file !== undefined) {
      const { uniqueId } = await this.crypto.generate({ id })
      const { url } = await this.uploadFile.upload({ key: uniqueId, file: file })
      pictureUrl = url
    }
    await this.userProfileRepository.savePicture({ pictureUrl })
  }
}

namespace ChangeProfilePicture {
  export type Params = {
    id: string
    file?: Buffer
  }
  export type Result = Promise<void>
}
