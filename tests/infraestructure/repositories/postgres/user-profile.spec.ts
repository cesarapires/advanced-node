import { makeFakeDb } from '@/../tests/infraestructure/repositories/postgres/mocks'
import { PostgresUserAccount } from '@/infraestructure/repositories/postgres/entities'
import { PostregresUserProfileRepository } from '@/infraestructure/repositories/postgres'

import { IBackup } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('PostgresLoadUserAccount', () => {
  let sut: PostregresUserProfileRepository
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
    sut = new PostregresUserProfileRepository()
  })

  afterEach(() => {
    backup.restore()
  })

  describe('SavePicture', () => {
    it('should update user profile', async () => {
      const { id } = await postgresUserRepository.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({
        id: id.toString(),
        pictureUrl: 'any_url',
        initials: undefined
      })
      const postresUser = await postgresUserRepository.findOne({ id })

      expect(postresUser).toMatchObject({
        id: 1,
        pictureUrl: 'any_url',
        initials: null
      })
    })
  })

  describe('LoadUserProfile', () => {
    it('should load user profile', async () => {
      const { id } = await postgresUserRepository.save({ email: 'any_email', name: 'any_name' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBe('any_name')
    })

    it('should return name undefined when name is user', async () => {
      const { id } = await postgresUserRepository.save({ email: 'any_email' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBeUndefined()
    })

    it('should not load user profile when user is undefined', async () => {
      const userProfile = await sut.load({ id: '1' })

      expect(userProfile).toBeUndefined()
    })
  })
})
