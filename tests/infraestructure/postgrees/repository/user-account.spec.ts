import { LoadUserAccountRepository } from '@/data/contracts/repository'

import { newDb } from 'pg-mem'
import { Column, Entity, PrimaryGeneratedColumn, getRepository } from 'typeorm'

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
  beforeEach(() => {

  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize()
      const postgreUserRepository = getRepository(PgUser)
      await postgreUserRepository.save({ email: 'existing_email' })
      const sut = new PostregreeUserAccountRepository()

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })

      await connection.close()
    })

    it('should return undefinied if not email exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize()

      const sut = new PostregreeUserAccountRepository()

      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
    })
  })
})
