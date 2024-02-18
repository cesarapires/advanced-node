import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'

type Adapter =(middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = middleware => async (request, response, next) => {
  const { statusCode, data } = await middleware.handle({ ...request.headers })
  if (statusCode === 200) {
    const entries = Object.entries(data).filter(entry => entry[1])
    request.locals = { ...request.locals, ...Object.fromEntries(entries) }
    next()
  } else {
    response.status(statusCode).json(data)
  }
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

    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined,
        prop: 'any_value'
      }
    })
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

  it('should respond with correct error and statusCode', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: { error: 'any_error' }
    })

    await sut(request, response, next)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })

  it('should add valid data to response.locals', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 200,
      data: {
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined,
        prop: 'any_value'
      }
    })

    await sut(request, response, next)

    expect(request.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
