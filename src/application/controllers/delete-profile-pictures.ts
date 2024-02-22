import { HttpResponse, noContent } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from '@/application/controllers'

type HttpRequest = { userId: string }

export class DeleteProfileController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform (params: HttpRequest): Promise<HttpResponse> {
    const { userId } = params
    await this.changeProfilePicture.perform({ id: userId })
    return noContent()
  }
}
