export interface SaveUserProfile {
  savePicture: (params: SaveUserProfile.Params) => Promise<void>
}

export namespace SaveUserProfile {
  export type Params = {
    id: string
    pictureUrl?: string
    initials?: string
  }
}
