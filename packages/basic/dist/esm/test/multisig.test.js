import { assert } from 'chai';
import { Multisig, Account } from '../src/';
import { Setup } from './utils/setup';
let source;
describe('Multisig', () => {
    before(async () => {
        const obj = await Setup.generatekeyPair();
        source = obj.source;
    });
    it('Is multisig address', async () => {
        const signer1 = Account.create();
        const signer2 = Account.create();
        const inst = await Multisig.create(2, source.secret.toKeypair(), [
            signer1.toPubkey(),
            signer2.toPubkey(),
        ]);
        assert.isTrue(inst.isOk, `${inst.unwrap()}`);
        const res = await inst.submit();
        assert.isTrue(res.isOk, `${res.unwrap()}`);
        const address = inst.unwrap().data;
        console.log('# multisig address: ', address);
        const isAddress = await Multisig.isAddress(address.toPubkey());
        assert.isTrue(isAddress.isOk);
        assert.isTrue(isAddress.unwrap());
    });
    it('[Err]Invalid multisig address', async () => {
        const signer1 = Account.create();
        const signer2 = Account.create();
        const inst = await Multisig.create(2, source.toKeypair(), [
            signer1.toPubkey(),
            signer2.toPubkey(),
        ]);
        const address = inst.unwrap().data;
        const res = await Multisig.isAddress(address.toPubkey());
        assert.isTrue(res.isOk);
        assert.isFalse(res.unwrap());
    });
    it('Create account 2 of 2', async () => {
        const signer1 = Account.create();
        const signer2 = Account.create();
        const inst = await Multisig.create(2, source.toKeypair(), [
            signer1.toPubkey(),
            signer2.toPubkey(),
        ]);
        assert.isTrue(inst.isOk, `${inst.unwrap()}`);
        const res = await inst.submit();
        assert.isTrue(res.isOk, `${res.unwrap()}`);
        console.log('# multisig account: ', inst.unwrap().data);
    });
    it('Create account 2 of 3', async () => {
        const signer1 = Account.create();
        const signer2 = Account.create();
        const signer3 = Account.create();
        const inst = await Multisig.create(2, source.toKeypair(), [
            signer1.toPubkey(),
            signer2.toPubkey(),
            signer3.toPubkey(),
        ]);
        assert.isTrue(inst.isOk, `${inst.unwrap()}`);
        const res = await inst.submit();
        assert.isTrue(res.isOk, `${res.unwrap()}`);
        console.log('# multisig account: ', inst.unwrap().data);
    });
    it('[Err] m number less than signers number', async () => {
        const signer1 = Account.create();
        const res = await Multisig.create(2, source.toKeypair(), [
            signer1.toPubkey(),
        ]);
        assert.isTrue(res.isErr);
    });
    it('Get multisig info', async () => {
        const signer1 = Account.create();
        const signer2 = Account.create();
        const inst = await Multisig.create(2, source.toKeypair(), [
            signer1.toPubkey(),
            signer2.toPubkey(),
        ]);
        assert.isTrue(inst.isOk, `${inst.unwrap()}`);
        await inst.submit();
        const res = await Multisig.getMultisigInfo(inst.unwrap().data.toPubkey());
        assert.isTrue(res.isOk, `${res.unwrap()}`);
    });
});
