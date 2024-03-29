export interface Authorize {
  perform: (params: Authorize.Params) => Promise<Authorize.Result>
}

export namespace Authorize {
  export type Params = {
    token: string
  }

  export type Result = string
}
