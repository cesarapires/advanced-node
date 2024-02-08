import { LoadUserAccountRepository } from '@/data/contracts/repository'

import { IBackup, newDb } from 'pg-mem'
import { Column, Entity, PrimaryGeneratedColumn, Repository, getConnection, getRepository } from 'typeorm'

class PostregreeUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const postreUserRepository = getRepository(PgUser)
    const postgresUser = await postreUserRepository.findOne({ email: params.email })

    if (postgresUser !== undefined) {
      return {
        id: postgresUser.id.toString(),
        name: postgresUser?.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'name', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string
}

describe('PostgreesUserAccountRepositpry', () => {
  describe('load', () => {
    let sut: PostregreeUserAccountRepository
    let postgreUserRepository: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize()

      backup = db.backup()
      postgreUserRepository = getRepository(PgUser)
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      sut = new PostregreeUserAccountRepository()
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
