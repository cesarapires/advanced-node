import { ChangeProfilePicture } from '@/domain/use-cases'
import { MockProxy, mock } from 'jest-mock-extended'
import { Controller, DeleteProfileController } from '@/application/controllers'

describe('DeleteProfileController', () => {
  let sut: DeleteProfileController
  let changeProfilePicture: MockProxy<ChangeProfilePicture>

  beforeAll(() => {
    changeProfilePicture = mock()
  })

  beforeEach(() => {
    sut = new DeleteProfileController(changeProfilePicture)
  })

  it('should extendes controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call ChangeProfilePicture with correct params', async () => {
    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture.perform).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})
