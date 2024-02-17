import { NextFunction, Request, RequestHandler, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { MockProxy, mock } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'
import { adaptExpressRoute } from '@/main/adapters'

describe('ExpressRouter', () => {
  let request: Request
  let response: Response
  let next: NextFunction
  let controller: MockProxy<Controller>

  let sut: RequestHandler

  beforeAll(() => {
    request = getMockReq({ body: { any: 'any' } })
    response = getMockRes().res
    next = getMockRes().next
    controller = mock()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' }
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = adaptExpressRoute(controller)
  })

  it('should call handle with corract request', async () => {
    await sut(request, response, next)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    request = getMockReq()

    await sut(request, response, next)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 200 and valid data', async () => {
    await sut(request, response, next)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 400 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    })

    await sut(request, response, next)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with 500 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('server_error')
    })

    await sut(request, response, next)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ error: 'server_error' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })
})
