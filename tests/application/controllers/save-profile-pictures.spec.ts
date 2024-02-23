import { ChangeProfilePicture } from '@/domain/use-cases'
import { MockProxy, mock } from 'jest-mock-extended'
import { Controller, SaveProfileController } from '@/application/controllers'
import { RequiredFieldError, MaxFileSizeError, InvalidMymeTypeError } from '@/application/errors'

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

  it('should return 400 if file is undefined', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id', file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is null', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id', file: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id', file: { buffer: Buffer.from(''), mimeType } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      file: {
        buffer,
        mimeType: 'invalid_mime_type'
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpeg'])
    })
  })

  it('should return 400 if file size is bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      file: {
        buffer: invalidBuffer,
        mimeType
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ userId: 'any_user_id', file })

    expect(changeProfilePicture.perform).toHaveBeenCalledWith({ id: 'any_user_id', file: buffer })
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
