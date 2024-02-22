import { AwsS3FileStorage } from '@/infraestructure/gateways/file-storage/aws'

import { config, S3 } from 'aws-sdk'
import { mocked } from 'ts-jest/utils'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage
  let accessKey: string
  let secret: string
  let bucket: string
  let key: string
  let file: Buffer

  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
    key = 'any_key'
    file = Buffer.from('any_buffer')
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
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

  it('should call putObject with correct input', async () => {
    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: 'any_bucket',
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
  })

  it('should return imageUrl', async () => {
    const imageUrl = await sut.upload({ key, file })

    expect(imageUrl).toEqual({
      url: `https://${bucket}.s3.amazonaws.com/${key}`
    })
  })

  it('should return encoded imageUrl', async () => {
    const imageUrl = await sut.upload({ key: 'any key', file })

    expect(imageUrl).toEqual({
      url: `https://${bucket}.s3.amazonaws.com/any%20key`
    })
  })

  it('should rethrow if putObject throw', async () => {
    putObjectPromiseSpy.mockRejectedValueOnce(new Error('aws_upload_error'))

    const promise = sut.upload({ key, file })

    await expect(promise).rejects.toThrow(new Error('aws_upload_error'))
  })
})
