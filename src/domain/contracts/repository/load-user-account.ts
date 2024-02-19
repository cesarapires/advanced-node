export interface LoadUserAccount {
  load: (params: LoadUserAccount.Params) => Promise<LoadUserAccount.Result>
}

export namespace LoadUserAccount {
  export type Params = {
    email: string
  }
  export type Result = undefined | {
    id: string
    name?: string
  }
}
