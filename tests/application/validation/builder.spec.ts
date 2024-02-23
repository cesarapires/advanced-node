import { RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationVuilder', () => {
  it('should return a RequiredString', () => {
    const validadors = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validadors).toEqual([new RequiredString('any_value', 'any_name')])
  })
})
