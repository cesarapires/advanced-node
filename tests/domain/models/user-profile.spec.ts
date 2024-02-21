import { UserProfile } from '@/domain/models'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'is defined' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create initials with first letter of first and last names', () => {
    sut.setPicture({ name: 'an any name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'AN'
    })
  })

  it('should create initials with first two letters of name', () => {
    sut.setPicture({ name: 'name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'NA'
    })
  })

  it('should create initials with first letter', () => {
    sut.setPicture({ name: 'n' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'N'
    })
  })

  it('should create with empty initials when name and pictureUrl are not defined', () => {
    sut.setPicture({ })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
