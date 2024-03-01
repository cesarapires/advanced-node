import { PostgresUserAccount } from '@/infraestructure/repositories/postgres/entities'
import { env } from '@/main/config/env'
import { makeFakeDb } from '@/tests/infraestructure/repositories/postgres/mocks'

import { IBackup } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

describe('User Routes', () => {
  let backup: IBackup
  let postgresUserRepository: Repository<PostgresUserAccount>

  beforeAll(async () => {
    const db = await makeFakeDb([PostgresUserAccount])
    backup = db.backup()
    postgresUserRepository = getRepository(PostgresUserAccount)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(() => {
    backup.restore()
  })

  describe('DELETE /users/picture', () => {
    it('should return 403 if authorization header is not present', async () => {
      const { app } = await import('@/main/config/app')

      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      const { app } = await import('@/main/config/app')
      const { id } = await postgresUserRepository.save({ email: 'any_email', name: 'any name' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(204)
      expect(body).toEqual({})
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()

    jest.mock('@/infraestructure/gateways/file-storage/aws/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))

    it('should return 403 if authorization header is not present', async () => {
      const { app } = await import('@/main/config/app')

      const { status } = await request(app)
        .put('/api/users/picture')

      expect(status).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      const { app } = await import('@/main/config/app')
      uploadSpy.mockResolvedValueOnce({ url: 'any_url' })

      const { id } = await postgresUserRepository.save({ email: 'any_email', name: 'any name' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})
