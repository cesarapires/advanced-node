import { makeFakeDb } from '@/tests/infraestructure/postgres/mocks'
import { PostgresUserAccount } from '@/infraestructure/postgres/entities'
import { PostregresLoadUserAccountRepository } from '@/infraestructure/postgres/repository'

import { IBackup } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('PostgresLoadUserAccountRepository', () => {
  let sut: PostregresLoadUserAccountRepository
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
    sut = new PostregresLoadUserAccountRepository()
  })

  afterEach(() => {
    backup.restore()
  })

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
