import { RequiredFieldError } from '@/application/errors'

export class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validade (): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new RequiredFieldError(this.fieldName)
    }
  }
}
