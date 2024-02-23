import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'
import { RequiredFieldError, MaxFileSizeError, InvalidMimeTypeError } from '@/application/errors'
import { HttpResponse, badRequest, ok } from '@/application/helpers'

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
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5))
    if (!['image/png', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    const profileData = await this.changeProfilePicture.perform({ id: userId, file: file.buffer })
    return ok(profileData)
  }
}
