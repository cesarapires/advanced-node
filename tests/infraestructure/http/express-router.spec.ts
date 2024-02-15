import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { MockProxy, mock } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'

class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (request: Request, response: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...request.body })

    if (httpResponse.statusCode === 200) {
      response.status(200).json(httpResponse.data)
    } else {
      response.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
  }
}

describe('ExpressRouter', () => {
  let request: Request
  let response: Response
  let controller: MockProxy<Controller>

  let sut: ExpressRouter

  beforeEach(() => {
    request = getMockReq({ body: { any: 'any' } })
    response = getMockRes().res
    controller = mock()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' }
    })

    sut = new ExpressRouter(controller)
  })

  it('should call handle with corract request', async () => {
    const sut = new ExpressRouter(controller)

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const request = getMockReq()

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 200 and valid data', async () => {
    await sut.adapt(request, response)

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

    await sut.adapt(request, response)

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

    await sut.adapt(request, response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledWith({ error: 'server_error' })
    expect(response.json).toHaveBeenCalledTimes(1)
  })
})
