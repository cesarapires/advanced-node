import { RequiredStringValidator, ValidationBuilder } from '@/application/validation'

describe('ValidationVuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validadors = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validadors).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })
})
