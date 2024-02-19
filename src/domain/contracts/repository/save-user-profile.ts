export interface SaveUserPictures {
  savePicture: (params: SaveUserPictures.Params) => Promise<void>
}

export namespace SaveUserPictures {
  export type Params = {
    pictureUrl?: string
  }
}
