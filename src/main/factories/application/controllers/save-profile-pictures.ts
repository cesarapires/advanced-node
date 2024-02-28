import { SaveProfileController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/domain/use-cases'

export const makeSaveProfileController = (): SaveProfileController => {
  const ChangeProfilePicture = makeChangeProfilePicture()
  return new SaveProfileController(ChangeProfilePicture)
}
