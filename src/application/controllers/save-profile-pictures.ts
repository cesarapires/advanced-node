import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = { userId: string, file: { buffer: Buffer, mimeType: string } }
type Model = Error | {
  pictureUrl?: string
  initials?: string
}

export class SaveProfileController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform (params: HttpRequest): Promise<HttpResponse<Model>> {
    const { userId, file } = params
    const profileData = await this.changeProfilePicture.perform({ id: userId, file: file.buffer })
    return ok(profileData)
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.file, fieldName: 'file' })
        .required()
        .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
        .build()
    ]
  }
}
