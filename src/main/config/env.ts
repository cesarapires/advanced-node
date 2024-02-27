export const env = {
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN ?? ''
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY ?? '',
    secret: process.env.AWS_SECRET ?? '',
    s3: {
      bucket: process.env.BUCKET_PICTURES_PROFILE ?? ''
    }
  },
  port: process.env.PORT ?? '3000',
  jwtSecret: process.env.JWT_SECRET ?? '123456'
}
