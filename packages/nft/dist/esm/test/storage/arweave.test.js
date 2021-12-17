import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Setup } from '../utils/setup';
import { RandomAsset } from '../utils/randomAsset';
import { StorageArweave } from '../../src';
let source;
describe('StorageArweave', () => {
    before(async () => {
        const obj = await Setup.generatekeyPair();
        source = obj.source;
    });
    it('Upload metadata json file and image', async () => {
        const asset = RandomAsset.storage();
        const res = await StorageArweave.upload(source.toKeypair(), asset);
        assert.isTrue(res.isOk);
        assert.isNotEmpty(res.unwrap());
        console.log('# arweave manifest url: ', res.unwrap());
    });
});
