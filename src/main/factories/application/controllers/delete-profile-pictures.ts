import { DeleteProfileController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/domain/use-cases'

export const makeDeleteProfileController = (): DeleteProfileController => {
  const ChangeProfilePicture = makeChangeProfilePicture()
  return new DeleteProfileController(ChangeProfilePicture)
}
