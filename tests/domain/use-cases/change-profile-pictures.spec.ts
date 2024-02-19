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

type Params = ChangeProfilePicture.Params
type Result = ChangeProfilePicture.Result

class ChangeProfilePicture {
  constructor (private readonly uploadFile: UploadFile) {}

  async perform (params: Params): Result {
    const { id, file } = params
    await this.uploadFile.upload({ key: id, file: file })
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

    const fileStorage = mock<UploadFile>()
    const sut = new ChangeProfilePicture(fileStorage)

    await sut.perform({ id: 'any_id', file: file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
