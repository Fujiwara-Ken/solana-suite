//////////////////////////////////////////////
// $ npx ts-node examples/integration1-metaplex-nft.ts
//////////////////////////////////////////////

import assert from 'assert';
import { Airdrop, KeypairStr } from '@solana-suite/core';
import { Metaplex } from '@solana-suite/nft';
import { Node, sleep } from '@solana-suite/shared';

import { RandomAsset } from '../packages/nft/test/randomAsset';

(async () => {
  //////////////////////////////////////////////
  // CREATE WALLET
  //////////////////////////////////////////////

  // create nft owner wallet, receive nft receipt wallet.
  const owner = KeypairStr.create();
  const receipt = KeypairStr.create();
  const feePayer = KeypairStr.create();

  // faucet 1 sol
  await Airdrop.request(feePayer.toPublicKey());

  console.log('# owner: ', owner.pubkey);
  console.log('# receipt: ', receipt.pubkey);
  console.log('# feePayer: ', feePayer.pubkey);

  //////////////////////////////////////////////
  // Upload contents
  //////////////////////////////////////////////

  // Only test that call this function
  // Usually set custom param
  const asset = RandomAsset.get();

  console.log(asset);

  //////////////////////////////////////////////
  // CREATE NFT, MINT NFT FROM THIS LINE
  //////////////////////////////////////////////

  const inst1 = await Metaplex.mint(
    {
      filePath: asset.filePath!,
      name: asset.name!,
      symbol: 'SAMPLE',
      royalty: 100,
      storageType: 'nftStorage',
    },
    owner.toPublicKey(),
    feePayer.toKeypair()
  );

  // this is NFT ID
  (await inst1.submit()).match(
    async (value) => await Node.confirmedSig(value),
    (error) => assert.fail(error)
  );

  await sleep(5);

  const mint = inst1.unwrap().data as string;
  console.log('# mint: ', mint);

  //////////////////////////////////////////////
  // Display metadata from blockchain(optional)
  //////////////////////////////////////////////

  const metadata = await Metaplex.findByOwner(owner.toPublicKey());

  metadata.match(
    (value) => console.log('# metadata: ', value),
    (error) => assert.fail(error)
  );

  //////////////////////////////////////////////
  // TRANSFER RECEIPTS USER FROM THIS LINE
  //////////////////////////////////////////////

  // transfer nft owner => publish
  const inst2 = await Metaplex.transfer(
    mint.toPublicKey(),
    owner.toPublicKey(),
    receipt.toPublicKey(),
    [owner.toKeypair()],
    feePayer.toKeypair()
  );

  // submit batch instructions
  (await inst2.submit()).match(
    (value) => console.log('# Transfer nft sig: ', value.toExplorerUrl()),
    (error) => assert.fail(error)
  );
})();
