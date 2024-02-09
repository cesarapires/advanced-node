import { AccessToken } from '@/domain/models'
import { RequiredFieldrError } from '@/application/errors'
import { HttpResponse, badRequest, serverError, unauthorized } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldrError('token'))
      }

      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })

      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value
          }
        }
      }

      return unauthorized()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
