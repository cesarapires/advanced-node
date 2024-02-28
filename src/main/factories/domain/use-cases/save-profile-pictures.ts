import { ChangeProfilePicture } from '@/domain/use-cases'
import { makeUniqueIdGeneratorHandler } from '@/main/factories/infraestructure/gateways/crypto'
import { makeAwsS3FileStorage } from '@/main/factories/infraestructure/gateways/file-storage/aws'
import { makePostregresUserProfileRepository } from '@/main/factories/infraestructure/repositories/postgres'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  const AwsS3FileStorage = makeAwsS3FileStorage()
  const UniqueIdGeneratorHandler = makeUniqueIdGeneratorHandler()
  const PostregresUserProfileRepository = makePostregresUserProfileRepository()
  return new ChangeProfilePicture(
    AwsS3FileStorage,
    UniqueIdGeneratorHandler,
    PostregresUserProfileRepository)
}
