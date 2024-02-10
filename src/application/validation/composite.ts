import { Validator } from '@/application/validation'

export class ValidationComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  validate (): Error | undefined {
    for (const validaor of this.validators) {
      const error = validaor.validate()

      if (error !== undefined) {
        return error
      }
    }
  }
}
