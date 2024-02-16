import { UnauthorizedError } from '@/application/errors'
import { makeFakeDb } from '@/tests/infraestructure/postgres/mocks'
import { PostgresUserAccount } from '@/infraestructure/postgres/entities'

import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import request from 'supertest'
import { FacebookApi } from '@/infraestructure/apis'
import { mocked } from 'ts-jest/utils'

jest.mock('@/infraestructure/apis/facebook')

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PostgresUserAccount])
      backup = db.backup()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()
    })

    it('should return 200 with AccessToken', async () => {
      const FacebookApiStub = jest.fn().mockImplementation(() => ({
        loadUser: jest.fn().mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })
      }))
      mocked(FacebookApi).mockImplementation(FacebookApiStub)

      const { app } = await import('@/main/config/app')

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { app } = await import('@/main/config/app')

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
