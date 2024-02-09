import { makeFakeDb } from '@/tests/infraestructure/postgres/mocks'
import { PostgresUserAccount } from '@/infraestructure/postgres/entities'
import { PostgresSaveUserAccountFacebookRepository } from '@/infraestructure/postgres/repository'

import { IBackup } from 'pg-mem'
import { Repository, getConnection, getRepository } from 'typeorm'

describe('PostgresSaveUserAccountFacebookRepository', () => {
  let sut: PostgresSaveUserAccountFacebookRepository
  let postgresUserRepository: Repository<PostgresUserAccount>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PostgresUserAccount])
    postgresUserRepository = getRepository(PostgresUserAccount)
    backup = db.backup()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(() => {
    sut = new PostgresSaveUserAccountFacebookRepository()
  })

  afterEach(() => {
    backup.restore()
  })

  it('should create an account if id is undefinied', async () => {
    const account = await sut.saveWithFacebook({
      name: 'any_name',
      email: 'any_email',
      facebookId: 'any_facebook_id'
    })

    expect(account).toEqual({
      id: '1'
    })
  })

  it('should update account if id is definied', async () => {
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
