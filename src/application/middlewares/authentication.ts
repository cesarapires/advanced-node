import { Authorize } from '@/domain/use-cases'
import { HttpResponse, forbidden, ok } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'
import { Middleware } from '@/application/middlewares'

type HttpRequest = { authorization: string }
type Model = Error | {userId: string}

export class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle (request: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (!this.validate(request)) throw new Error()
      const { authorization } = request
      const userId = await this.authorize.perform({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
