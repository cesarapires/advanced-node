import { makeFakeDb } from '@/tests/infraestructure/repositories/mocks'
import { PostgresUserAccount } from '@/infraestructure/repositories/postgres/entities'
import { PostregresUserAccountRepository } from '@/infraestructure/repositories/postgres'

import { IBackup } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('PostgresLoadUserAccount', () => {
  let sut: PostregresUserAccountRepository
  let postgresUserRepository: Repository<PostgresUserAccount>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PostgresUserAccount])

    backup = db.backup()
    postgresUserRepository = getRepository(PostgresUserAccount)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(() => {
    sut = new PostregresUserAccountRepository()
  })

  afterEach(() => {
    backup.restore()
  })

  describe('Load', () => {
    it('should return an account if email exists', async () => {
      await postgresUserRepository.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if not email exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('Save', () => {
    it('should create an account if id is undefined', async () => {
      const account = await sut.saveWithFacebook({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_facebook_id'
      })

      expect(account).toEqual({
        id: '1'
      })
    })

    it('should update account if id is defined', async () => {
      await postgresUserRepository.save({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_facebook_id'
      })

      const account = await sut.saveWithFacebook({
        id: '1',
        name: 'new_name',
        email: 'any_email',
        facebookId: 'new_facebook_id'
      })

      const accountUpdated = await postgresUserRepository.findOne({ id: 1 })

      expect(account).toEqual({
        id: '1'
      })
      expect(accountUpdated).toEqual({
        id: 1,
        name: 'new_name',
        email: 'any_email',
        facebookId: 'new_facebook_id'
      })
    })
  })
})
