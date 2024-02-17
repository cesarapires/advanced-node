import { Authorize } from '@/domain/use-cases'
import { MockProxy, mock } from 'jest-mock-extended'
import { ForbiddenError } from '@/application/errors'
import { HttpResponse, forbidden, ok } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'

type HttpRequest = { authorization: string }
type Model = Error | {userId: string}

class AuthenticationMiddleware {
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
describe('AuthenticationMiddleware', () => {
  let authorization: string
  let sut: AuthenticationMiddleware
  let authorize: MockProxy<Authorize>

  beforeAll(() => {
    authorize = mock()
    authorize.perform.mockResolvedValue('any_user_id')
    authorization = 'any_authorization_token'
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AuthenticationMiddleware(authorize)
  })

  it('should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should call authorize with correct params', async () => {
    await sut.handle({ authorization })

    expect(authorize.perform).toHaveBeenCalledWith({ token: authorization })
    expect(authorize.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 403 if authorize throws', async () => {
    authorize.perform.mockRejectedValueOnce(new Error('any_error'))

    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 200 with userId on success', async () => {
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { userId: 'any_user_id' }
    })
  })
})
