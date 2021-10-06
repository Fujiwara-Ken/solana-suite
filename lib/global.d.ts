import { PublicKey, Keypair } from '@solana/web3.js';
declare global {
    interface String {
        toPubKey(): PublicKey;
        toKeypair(): Keypair;
        toSigUrl(): string;
        toAddressUrl(): string;
    }
}
