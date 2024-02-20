export interface SaveUserProfile {
  savePicture: (params: SaveUserProfile.Params) => Promise<void>
}

export namespace SaveUserProfile {
  export type Params = {
    pictureUrl?: string
    initials?: string
  }
}
