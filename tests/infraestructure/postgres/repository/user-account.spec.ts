import { PostgresUserAccount } from '@/infraestructure/postgres/entities'
import { PostregresUserAccountRepository } from '@/infraestructure/postgres/repository'

import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infraestructure/postgres/entities/index.ts']
  })

  await connection.synchronize()

  return db
}

describe('PostgreesUserAccountRepositpry', () => {
  describe('load', () => {
    let sut: PostregresUserAccountRepository
    let postgreUserRepository: Repository<PostgresUserAccount>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PostgresUserAccount])

      backup = db.backup()
      postgreUserRepository = getRepository(PostgresUserAccount)
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

    it('should return an account if email exists', async () => {
      await postgreUserRepository.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefinied if not email exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
