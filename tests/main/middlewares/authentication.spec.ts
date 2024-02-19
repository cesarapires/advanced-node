
import { auth } from '@/main/middlewares'
import { ForbiddenError } from '@/application/errors'

import request from 'supertest'

jest.mock('@/infraestructure/apis/facebook')

describe('Authentication Middleware', () => {
  it('should returns 403 if authorization header was not provided', async () => {
    const { app } = await import('@/main/config/app')

    app.get('/fake_route', auth)

    const { status, body } = await request(app)
      .get('/fake_route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})
