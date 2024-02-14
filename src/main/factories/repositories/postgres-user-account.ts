import { PostregresUserAccountRepository } from '@/infraestructure/postgres/repository'

export const makePostregresUserAccountRepository = (): PostregresUserAccountRepository => {
  return new PostregresUserAccountRepository()
}
