import { PostregresUserAccountRepository } from '@/infraestructure/repositories/postgres'

export const makePostregresUserAccountRepository = (): PostregresUserAccountRepository => {
  return new PostregresUserAccountRepository()
}
