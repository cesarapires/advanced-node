export interface LoadFacebookApiUserApi {
  loadUser: (params: LoadFacebookApiUserApi.Params) => Promise<LoadFacebookApiUserApi.Result>
}

export namespace LoadFacebookApiUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}
