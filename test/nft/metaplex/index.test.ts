import {describe, it} from 'mocha';
import {assert} from 'chai'
import {Metaplex} from '../../../src/nft/metaplex';
import setupKeyPair from '../../../test/utils/setupKeyPair';
import {Wallet} from '../../../src/wallet';

let source: Wallet.Keypair;
let dest: Wallet.Keypair;
const tokenKey = 'J6gikJi9rWxqLyEME1S1J2WfFk9x6gMAvz7QPHMhra6e';
describe('Metaplex', () => {
  before(async () => {
    const obj = await setupKeyPair();
    source = obj.source;
    dest = obj.dest;
  });

  after(async () => {
    // refund nft
    await Metaplex.transfer(
      tokenKey,
      dest.secret,
      source.pubkey
    );
    console.log('# refund finished');
  });

  it('transfer nft', async () => {
    const res = await Metaplex.transfer(
      tokenKey,
      source.secret,
      dest.pubkey
    );
    console.log('# transfer tx:', res);
    assert.isNotEmpty(res);
  });
})
