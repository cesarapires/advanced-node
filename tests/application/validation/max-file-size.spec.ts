import { MaxFileSizeError } from '@/application/errors'
import { MaxFileSize } from '@/application/validation'

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new MaxFileSize(5, Buffer.from(new ArrayBuffer(6 * 1024 * 1024)))

    const error = sut.validate()

    expect(error).toEqual(new MaxFileSizeError(5))
  })

  it('should return undefined if value is valid', () => {
    const sut = new MaxFileSize(5, Buffer.from(new ArrayBuffer(5 * 1024 * 1024)))

    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return undefined if value is valid', () => {
    const sut = new MaxFileSize(5, Buffer.from(new ArrayBuffer(4 * 1024 * 1024)))

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
