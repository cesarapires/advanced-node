import { AwsS3FileStorage } from '@/infraestructure/gateways/file-storage/aws'

import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage
  let accessKey: string
  let secret: string
  let bucket: string

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket)
  })

  it('should config aws credentials on creation', () => {
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: 'any_access_key',
        secretAccessKey: 'any_secret'
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })

  describe('UploadFile', () => {
    let fileName: string
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock

    beforeAll(() => {
      fileName = 'any_fileName'
      file = Buffer.from('any_buffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
    })

    it('should call putObject with correct input', async () => {
      await sut.upload({ fileName, file })

      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: 'any_bucket',
        Key: fileName,
        Body: file,
        ACL: 'public-read'
      })
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
      expect(putObjectSpy).toHaveBeenCalledTimes(1)
    })

    it('should return imageUrl', async () => {
      const imageUrl = await sut.upload({ fileName, file })

      expect(imageUrl).toEqual({
        url: `https://${bucket}.s3.amazonaws.com/${fileName}`
      })
    })

    it('should return encoded imageUrl', async () => {
      const imageUrl = await sut.upload({ fileName: 'any fileName', file })

      expect(imageUrl).toEqual({
        url: `https://${bucket}.s3.amazonaws.com/any%20fileName`
      })
    })

    it('should rethrow if putObject throw', async () => {
      putObjectPromiseSpy.mockRejectedValueOnce(new Error('aws_upload_error'))

      const promise = sut.upload({ fileName, file })

      await expect(promise).rejects.toThrow(new Error('aws_upload_error'))
    })
  })

  describe('DeleteFile', () => {
    let fileName: string
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      fileName = 'any_fileName'
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    it('should call deleteObject with correct input', async () => {
      await sut.delete({ fileName })

      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: 'any_bucket',
        Key: fileName
      })
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
    })

    it('should rethrow if deleteObject throw', async () => {
      deleteObjectPromiseSpy.mockRejectedValueOnce(new Error('aws_delete_error'))

      const promise = sut.delete({ fileName })

      await expect(promise).rejects.toThrow(new Error('aws_delete_error'))
    })
  })
})
