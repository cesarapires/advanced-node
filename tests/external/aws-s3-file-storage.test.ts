import { env } from '@/main/config/env'
import { AwsS3FileStorage } from '@/infraestructure/gateways/file-storage/aws'

import axios from 'axios'

describe('Aws S3 Integration Tests', () => {
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(
      env.aws.accessKey,
      env.aws.secret,
      env.aws.s3.bucket
    )
  })

  it('should upload and delete image from aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const key = 'any_file_name.png'

    const { url } = await sut.upload({ key, file })

    expect((await axios.get(url)).status).toBe(200)

    await sut.delete({ key })

    await expect(axios.get(url)).rejects.toThrow()
  })
})
