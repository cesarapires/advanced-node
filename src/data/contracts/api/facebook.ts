export interface LoadFacebookApiUser {
  loadUser: (params: LoadFacebookApiUser.Params) => Promise<LoadFacebookApiUser.Result>
}

export namespace LoadFacebookApiUser {
  export type Params = {
    token: string
  }

  export type Result = undefined | {
    name: string
    email: string
    facebookId: string
  }
}
