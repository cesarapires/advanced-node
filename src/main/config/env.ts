export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ''
  },
  port: process.env.PORT ?? '3000',
  jwtSecret: process.env.JWT_SECRET ?? '123456'
}
