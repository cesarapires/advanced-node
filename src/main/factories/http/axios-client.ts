import { AxiosHttpClient } from '@/infraestructure/http'

export const makeAxiosHttpClient = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}
