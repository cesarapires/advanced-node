import { ChangeProfilePicture } from '@/domain/use-cases'
import { MockProxy, mock } from 'jest-mock-extended'
import { Controller, SaveProfileController } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

describe('SaveProfileController', () => {
  let sut: SaveProfileController
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let changeProfilePicture: MockProxy<ChangeProfilePicture>

  beforeAll(() => {
    changeProfilePicture = mock()
    changeProfilePicture.perform.mockResolvedValue({ pictureUrl: 'any_url' })
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
  })

  beforeEach(() => {
    sut = new SaveProfileController(changeProfilePicture)
  })

  it('should extendes controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build Validators correctly on save', async () => {
    const validators = sut.buildValidators({ file, userId: 'any_user_id' })

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ userId: 'any_user_id', file })

    expect(changeProfilePicture.perform).toHaveBeenCalledWith({ id: 'any_user_id', file: file })
    expect(changeProfilePicture.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id', file })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        pictureUrl: 'any_url'
      }
    })
  })
})
