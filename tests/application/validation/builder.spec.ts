import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_field')])
  })

  it('should return RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: buffer, fieldName: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })

  it('should return Required', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'any' }, fieldName: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([new Required({ any: 'any' }, 'any_field')])
  })

  it('should return Required', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer }, fieldName: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([
      new Required({ buffer }, 'any_field'),
      new RequiredBuffer(buffer)
    ])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer }, fieldName: 'any_field' })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new MaxFileSize(6, buffer)])
  })

  it('should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'image/png' }, fieldName: 'any_field' })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'image/png' }, fieldName: 'any_field' })
      .image({ allowed: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png'], 'image/png'),
      new MaxFileSize(6, buffer)
    ])
  })
})
