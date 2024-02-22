import { UploadFile } from '@/domain/contracts/gateways/file-storage'
import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile {
  private readonly acl = 'public-read'

  constructor (
    private readonly accessKey: string,
    private readonly secret: string,
    private readonly bucket: string
  ) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload (params: UploadFile.Params): Promise<UploadFile.Result> {
    const { key, file } = params
    const s3 = new S3()

    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: this.acl
    }).promise()

    return {
      url: `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
    }
  }
}
