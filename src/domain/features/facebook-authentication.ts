import { type AccessToken } from '@/domain/models'
import { type AuthenticationError } from '@/domain/errors'

export interface FacebookAuthentican {
  perform: (params: FacebookAuthentican.Params) => Promise<FacebookAuthentican.Result>
}

namespace FacebookAuthentican{
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
