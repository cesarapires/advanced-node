import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'

class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (request: Request, response: Response): Promise<void> {
    await this.controller.handle({ ...request.body })
  }
}

describe('ExpressRouter', () => {
  it('should call handle with corract request', async () => {
    const request = getMockReq({ body: { any: 'any' } })
    const { res } = getMockRes()
    const controller = mock<Controller>()

    const sut = new ExpressRouter(controller)

    await sut.adapt(request, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })
})
