import { RequiredFieldError } from '@/application/errors'
import { Validator } from '@/application/validation'

export class Required implements Validator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
