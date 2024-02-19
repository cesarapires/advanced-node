export const env = {
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN ?? ''
  },
  port: process.env.PORT ?? '3000',
  jwtSecret: process.env.JWT_SECRET ?? '123456'
}
