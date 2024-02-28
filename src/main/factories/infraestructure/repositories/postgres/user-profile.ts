import { PostregresUserProfileRepository } from '@/infraestructure/repositories/postgres'

export const makePostregresUserProfileRepository = (): PostregresUserProfileRepository => {
  return new PostregresUserProfileRepository()
}
