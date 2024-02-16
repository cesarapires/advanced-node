import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/models/errors'
import { UnauthorizedError } from '@/application/errors'
import { FacebookAuthentication } from '@/domain/use-cases'
import { RequiredStringValidator } from '@/application/validation'
import { FacebookLoginController } from '@/application/controllers'

import { MockProxy, mock } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>
  let token: string

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
    token = 'any_token'
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new FacebookLoginController(facebookAuth)
  })

  it('should build Validators correctly', async () => {
    const validators = await sut.buildValidators({ token: '' })

    expect(validators).toEqual([
      new RequiredStringValidator('', 'token')
    ])
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token: token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication success', async () => {
    const httpResponse = await sut.handle({ token: token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: token })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: token })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })
})
