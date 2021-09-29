// tslint:disable-next-line
export interface Attributes {}
// tslint:disable-next-line
export interface Collection {}
// tslint:disable-next-line
export interface Properties {}
// tslint:disable-next-line
export interface Creators {}

export interface MetadataFormat {
  name: string,
  uri: string,
  symbol: string,
  update_authority: string,
  creators?: Creators[],
  seller_fee_basis_points?: number,
  primary_sale_happened?: boolean,
}

export interface MetadataStorageFormat {
  name: string,
  description: string,
  image: string,
  symbol?: string,
  seller_fee_basis_points?: number,
  animation_url?: string,
  external_url?: string,
  category?: string,
  attributes?: Attributes[],
  collection?: Collection,
  properties?: Properties[],
  creators?: Creators[],
}

export namespace Storage {
  export const initStorageData = (): MetadataStorageFormat => {
    return {
      name: '',
      description: '',
      image: '',
      symbol: '',
      seller_fee_basis_points: 0,
      animation_url: '',
      external_url: '',
      category: '',
      attributes: [],
      collection: {},
      properties: [],
      creators: [],
    }
  }
}

