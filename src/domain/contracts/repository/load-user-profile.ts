export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<void>
}

export namespace LoadUserProfile {
  export type Params = {
    id: string
  }
}
