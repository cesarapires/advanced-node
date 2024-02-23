import { RequiredFieldError } from '@/application/errors'
import { Validator } from '@/application/validation'

export class Required implements Validator {
  constructor (
    readonly value: any,
    readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}

export class RequiredString extends Required {
  constructor (
    override readonly value: string,
    override readonly fieldName: string
  ) {
    super(value, fieldName)
  }

  validate (): Error | undefined {
    if (this.value === '' || super.validate() !== undefined) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
