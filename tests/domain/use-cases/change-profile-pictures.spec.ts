import { UserProfile } from '@/domain/models'
import { FileProps } from '@/domain/models/file-props'
import { UploadFile, DeleteFile } from '@/domain/contracts/gateways/file-storage'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { UniqueIdGenerator } from '@/domain/contracts/gateways/crypto'
import { SaveUserProfile, LoadUserProfile } from '@/domain/contracts/repositories'

import { MockProxy, mock } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

jest.mock('@/domain/models/user-profile')

describe('ChangeProfilePicture', () => {
  let file: FileProps
  let sut: ChangeProfilePicture
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let userProfileRepository: MockProxy<SaveUserProfile & LoadUserProfile>
  let crypto: MockProxy<UniqueIdGenerator>
  const pathFile = 'private/user/profile'
  const uuid = 'any_unique_id'

  beforeAll(() => {
    file = { buffer: Buffer.from('any_buffer'), mimeType: 'image/png' }
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue({ url: 'any_url' })
    userProfileRepository = mock()
    userProfileRepository.load.mockResolvedValue({ name: 'Cesar Augusto Pires' })
    crypto = mock()
    crypto.generate.mockResolvedValue({ uniqueId: uuid })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new ChangeProfilePicture(fileStorage, crypto, userProfileRepository)
  })

  it('should call UploadFile with correct params', async () => {
    const fileName = `${pathFile}/${uuid}.jpeg`
    await sut.perform({
      id: 'any_id',
      file:
      {
        buffer: Buffer.from('any_buffer'),
        mimeType: 'image/jpeg'
      }
    })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: file.buffer, fileName })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should not call UploadFile when file is undefined', async () => {
    await sut.perform({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toBeCalled()
  })

  it('should call SaveUserPictures whit correct input when load return undefined', async () => {
    mocked(UserProfile).mockImplementation(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))
    userProfileRepository.load.mockResolvedValueOnce(undefined)

    await sut.perform({ id: 'any_id', file: file })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith((expect.objectContaining({
      id: 'any_id',
      initials: 'any_initials',
      pictureUrl: 'any_url'
    })))
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPictures whit correct input', async () => {
    mocked(UserProfile).mockImplementation(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    await sut.perform({ id: 'any_id', file: file })

    expect(userProfileRepository.savePicture).toHaveBeenCalledWith((expect.objectContaining({
      id: 'any_id',
      initials: 'any_initials',
      pictureUrl: 'any_url'
    })))
    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserProfile whit correct input', async () => {
    await sut.perform({ id: 'any_id', file: undefined })

    expect(userProfileRepository.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should not call LoadUserProfile if file exists', async () => {
    await sut.perform({ id: 'any_id', file: file })

    expect(userProfileRepository.load).not.toHaveBeenCalled()
  })

  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementation(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    const result = await sut.perform({ id: 'any_id', file: file })

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })

  it('should call DeleteFile when file exists and SaveUserPictures throw', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error('error'))

    sut.perform({ id: 'any_id', file: file }).catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('should not call DeleteFile when file does not exists and SaveUserPictures throw', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error('error'))

    sut.perform({ id: 'any_id', file: undefined }).catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  it('should rethrow if SaveUserPictures throw', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(new Error('save_user_error'))

    const promise = sut.perform({ id: 'any_id', file: file })

    await expect(promise).rejects.toThrow(new Error('save_user_error'))
  })

  it('should rethrow if UploadFile throw', async () => {
    fileStorage.upload.mockRejectedValueOnce(new Error('update_file_error'))

    const promise = sut.perform({ id: 'any_id', file: file })

    await expect(promise).rejects.toThrow(new Error('update_file_error'))
  })

  it('should rethrow if LoadUserProfile throw', async () => {
    userProfileRepository.load.mockRejectedValueOnce(new Error('load_user_error'))

    const promise = sut.perform({ id: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(new Error('load_user_error'))
  })
})
