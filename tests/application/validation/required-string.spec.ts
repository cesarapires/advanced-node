import { RequiredFieldError } from '@/application/errors'

class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validade (): Error | undefined {
    return new RequiredFieldError('any_field')
  }
}

describe('RequiredStringValidator', () => {
  it('should return RequiredStringValidator if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field')

    const error = sut.validade()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredStringValidator if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field')

    const error = sut.validade()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredStringValidator if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field')

    const error = sut.validade()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })
})