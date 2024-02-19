export interface UniqueIdGenerator {
  generate: (params: UniqueIdGenerator.Params) => Promise<UniqueIdGenerator.Result>
}

export namespace UniqueIdGenerator {
  export type Params = {
    id: string
  }
  export type Result = {
    uniqueId: string
  }
}
