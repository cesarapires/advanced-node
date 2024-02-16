import { JwtTokenHandler } from '@/infraestructure/crypto'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeEach(() => {
    sut = new JwtTokenHandler('any_secret')
  })

  describe('generateToken', () => {
    beforeAll(() => {
      fakeJwt = jwt as jest.Mocked<typeof jwt>
      fakeJwt.sign.mockImplementation(() => 'any_token')
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({ key: 'any_token', expirationInMs: 1000 })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_token' }, 'any_secret', { expiresIn: 1 })
    })

    it('should return a token', async () => {
      const token = await sut.generateToken({ key: 'any_token', expirationInMs: 1000 })

      expect(token).toEqual('any_token')
    })

    it('should rethrow if sign throw', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

      const promise = sut.generateToken({ key: 'any_token', expirationInMs: 1000 })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })

  describe('validateToken', () => {
    let key: string
    let token: string
    beforeAll(() => {
      fakeJwt = jwt as jest.Mocked<typeof jwt>
      key = 'any_key'
      token = 'any_token'
      fakeJwt.verify.mockImplementation(() => ({ key }))
    })

    it('should call verify with correct params', async () => {
      await sut.validateToken({ token })

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, 'any_secret')
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })

    it('should return the key used to sign', async () => {
      const generatedKey = await sut.validateToken({ token })

      expect(generatedKey).toBe(key)
    })

    it('should rethrow if verify throw', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('key_error') })

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow(new Error('key_error'))
    })

    it('should throw if verify returns undefined', async () => {
      fakeJwt.verify.mockImplementationOnce(() => undefined)

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow()
    })

    it('should throw if verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null)

      const promise = sut.validateToken({ token })

      await expect(promise).rejects.toThrow()
    })
  })
})
