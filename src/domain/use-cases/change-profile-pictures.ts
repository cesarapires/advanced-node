import { UploadFile } from '@/domain/contracts/gateway'
import { UniqueIdGenerator } from '@/domain/contracts/crypto'

type Params = ChangeProfilePicture.Params
type Result = ChangeProfilePicture.Result

export class ChangeProfilePicture {
  constructor (
    private readonly uploadFile: UploadFile,
    private readonly crypto: UniqueIdGenerator
  ) {}

  async perform (params: Params): Result {
    const { id, file } = params
    if (file !== undefined) {
      const { uniqueId } = await this.crypto.generate({ id })
      await this.uploadFile.upload({ key: uniqueId, file: file })
    }
  }
}

namespace ChangeProfilePicture {
  export type Params = {
    id: string
    file?: Buffer
  }
  export type Result = Promise<void>
}
