export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The field ${fieldName} is required`)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidMymeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported type. Allow types: ${allowed.join(', ')}`)
    this.name = 'InvalidMymeTypeError'
  }
}

export class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit is: ${maxSizeInMb}`)
    this.name = 'MaxFileSizeError'
  }
}