
import { env } from '@/main/config/env'
import { auth } from '@/main/middlewares'
import { ForbiddenError } from '@/application/errors'

import request from 'supertest'
import { sign } from 'jsonwebtoken'

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

  it('should returns 200 if authorization header is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)

    const { app } = await import('@/main/config/app')

    app.get('/fake_route', auth, (request, respose) => {
      respose.json(request.locals)
    })

    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization })

    expect(status).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})
