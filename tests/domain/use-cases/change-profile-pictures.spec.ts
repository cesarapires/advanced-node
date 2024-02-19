import { UploadFile } from '@/domain/contracts/gateway'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { UniqueIdGenerator } from '@/domain/contracts/crypto'

import { MockProxy, mock } from 'jest-mock-extended'

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
