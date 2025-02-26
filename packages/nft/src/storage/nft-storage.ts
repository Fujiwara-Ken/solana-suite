import { NFTStorage, Blob } from 'nft.storage';
import fs from 'fs';
import {
  Constants,
  Result,
  isNode,
  isBrowser,
  debugLog,
} from '@solana-suite/shared';

import { useMetaplexFileFromBrowser } from '@metaplex-foundation/js';
import { NftStorageMetadata } from '../types/storage';
import { MetaplexRoyalty } from '../metaplex';
import { Validator, ValidatorError } from '../validator';

export namespace StorageNftStorage {
  const getNftStorageApiKey = (): string => {
    if (!Constants.nftStorageApiKey) {
      console.warn(
        `
        [Warning]
        --------------------------------------
        If will use @solana-suite/nft package
        your need to update nftStorage.apiKey define parameter in solana-suite.json.
        can get apiKey from https://nft.storage/
        --------------------------------------
        `
      );
      return Constants.NFT_STORAGE_API_KEY;
    } else {
      return Constants.nftStorageApiKey;
    }
  };

  const createGatewayUrl = (cid: string): string =>
    `${Constants.NFT_STORAGE_GATEWAY_URL}/${cid}`;

  const connect = new NFTStorage({ token: getNftStorageApiKey() });

  export const uploadContent = async (
    filePath: string | File
  ): Promise<Result<string, Error>> => {
    debugLog('# upload content: ', filePath);
    let file!: Buffer;
    if (isNode) {
      const filepath = filePath as string;
      file = fs.readFileSync(filepath);
    } else if (isBrowser) {
      const filepath = filePath as File;
      file = (await useMetaplexFileFromBrowser(filepath)).buffer;
    } else {
      return Result.err(
        Error('Supported environment: only Node.js and Browser js')
      );
    }

    const blobImage = new Blob([file]);
    const res = (await connect
      .storeBlob(blobImage)
      .then(Result.ok)
      .catch(Result.err)) as Result<string, Error>;

    return res.map(
      (ok) => createGatewayUrl(ok),
      (err) => err
    );
  };

  /**
   * Upload content
   *
   * @param {NftStorageMetadata} metadata
   * {
   *   name?: {string}                      // nft content name
   *   symbol?: {string}                    // nft ticker symbol
   *   description?: {string}               // nft content description
   *   sellerFeeBasisPoints?: number        // royalty percentage
   *   image?: {string}                     // uploaded uri of original content
   *   external_url?: {string}              // landing page, home page uri, related url
   *   attributes?: {JsonMetadataAttribute[]}     // game character parameter, personality, characteristics
   *   properties?: {JsonMetadataProperties<Uri>} // included file name, uri, supported file type
   *   collection?: Collection              // collections of different colors, shapes, etc.
   *   [key: string]: {unknown}             // optional param, Usually not used.
   * }
   * @return Promise<Result<string, Error>>
   */
  export const uploadMetadata = async (
    metadata: NftStorageMetadata
  ): Promise<Result<string, Error | ValidatorError>> => {
    debugLog('# upload metadata: ', metadata);

    const valid = Validator.checkAll(metadata);
    if (valid.isErr) {
      return valid;
    }

    if (metadata.seller_fee_basis_points) {
      metadata.seller_fee_basis_points = MetaplexRoyalty.convertValue(
        metadata.seller_fee_basis_points
      );
    }

    const blobJson = new Blob([JSON.stringify(metadata)]);
    const res = (await connect
      .storeBlob(blobJson)
      .then(Result.ok)
      .catch(Result.err)) as Result<string, Error>;

    return res.map(
      (ok) => createGatewayUrl(ok),
      (err) => err
    );
  };
}
