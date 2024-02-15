import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { MockProxy, mock } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'

class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (request: Request, response: Response): Promise<void> {
    await this.controller.handle({ ...request.body })
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

    sut = new ExpressRouter(controller)
  })

  it('should call handle with corract request', async () => {
    const sut = new ExpressRouter(controller)

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with empty request', async () => {
    const request = getMockReq()

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
