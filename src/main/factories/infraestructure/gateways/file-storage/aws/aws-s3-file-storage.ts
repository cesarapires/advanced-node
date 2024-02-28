import { AwsS3FileStorage } from '@/infraestructure/gateways/file-storage/aws'
import { env } from '@/main/config/env'

export const makeAwsS3FileStorage = (): AwsS3FileStorage => {
  return new AwsS3FileStorage(env.aws.accessKey, env.aws.secret, env.aws.s3.bucket)
}
