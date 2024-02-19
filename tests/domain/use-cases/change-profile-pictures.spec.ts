import { UploadFile } from '@/domain/contracts/gateway'
import { UniqueIdGenerator } from '@/domain/contracts/crypto'

import { MockProxy, mock } from 'jest-mock-extended'

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
  let file: Buffer
  let sut: ChangeProfilePicture
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UniqueIdGenerator>
  const uuid = 'any_unique_id'

  beforeAll(() => {
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    crypto = mock()
    crypto.generate.mockResolvedValue({ uniqueId: uuid })
  })

  beforeEach(() => {
    sut = new ChangeProfilePicture(fileStorage, crypto)
  })

  it('should call UploadFile with correct params', async () => {
    await sut.perform({ id: 'any_id', file: file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
