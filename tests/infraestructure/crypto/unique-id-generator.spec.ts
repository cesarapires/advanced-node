import { UniqueIdGeneratorHandler } from '@/infraestructure/crypto'

import { mocked } from 'ts-jest/utils'
import { v4 } from 'uuid'

jest.mock('uuid')

describe('UniqueIdGenerator', () => {
  let sut: UniqueIdGeneratorHandler

  beforeAll(() => {
    mocked(v4).mockReturnValue('any_uuid')
  })

  beforeEach(() => {
    sut = new UniqueIdGeneratorHandler()
  })

  it('should call uuid v4', async () => {
    await sut.generate({ id: 'any_id' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid ', async () => {
    const { uniqueId } = await sut.generate({ id: 'any_id' })

    expect(uniqueId).toBe('any_uuid_any_id')
  })
})
