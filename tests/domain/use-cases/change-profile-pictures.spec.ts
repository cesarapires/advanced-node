import { mock } from 'jest-mock-extended'

interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<void>
}

export namespace UploadFile {
  export type Params = {
    key: string
    file: Buffer
  }
}

interface UniqueIdGenerator {
  generate: (params: UniqueIdGenerator.Params) => Promise<UniqueIdGenerator.Result>
}

export namespace UniqueIdGenerator {
  export type Params = {
    id: string
  }
  export type Result = {
    uniqueId: string
  }
}

type Params = ChangeProfilePicture.Params
type Result = ChangeProfilePicture.Result

class ChangeProfilePicture {
  constructor (
    private readonly uploadFile: UploadFile,
    private readonly crypto: UniqueIdGenerator
  ) {}

  async perform (params: Params): Result {
    const { id, file } = params
    const { uniqueId } = await this.crypto.generate({ id })
    await this.uploadFile.upload({ key: uniqueId, file: file })
  }
}

export namespace ChangeProfilePicture {
  export type Params = {
    id: string
    file: Buffer
  }
  export type Result = Promise<void>
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct params', async () => {
    const file = Buffer.from('any_buffer')

    const uuid = 'any_unique_id'
    const fileStorage = mock<UploadFile>()
    const crypto = mock<UniqueIdGenerator>()
    crypto.generate.mockResolvedValue({ uniqueId: uuid })
    const sut = new ChangeProfilePicture(fileStorage, crypto)

    await sut.perform({ id: 'any_id', file: file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
