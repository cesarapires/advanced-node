export interface UploadFile {
  upload: (params: UploadFile.Params) => Promise<UploadFile.Result>
}

export namespace UploadFile {
  export type Params = {
    key: string
    file: Buffer
  }
  export type Result = {
    url: string
  }
}
