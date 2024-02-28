export interface DeleteFile {
  delete: (params: DeleteFile.Params) => Promise<void>
}

export namespace DeleteFile {
  export type Params = {
    fileName: string
  }
}
