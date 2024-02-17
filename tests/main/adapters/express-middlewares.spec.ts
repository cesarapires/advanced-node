import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'

type Adapter =(middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = middleware => async (request, response, next) => {
  await middleware.handle({ ...request.headers })
}

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('ExpressMiddleware', () => {
  let request: Request
  let response: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeAll(() => {
    request = getMockReq({ headers: { any: 'any' } })
    response = getMockRes().res
    next = getMockRes().next
    middleware = mock()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call handle with correct request', async () => {
    await sut(request, response, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    request = getMockReq()

    await sut(request, response, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
