import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Node, Result } from '@solana-suite/shared';
import { SolNativeOwnerInfo } from '../types/sol-native';

export namespace SolNative {
  export const findByOwner = async (
    owner: PublicKey
  ): Promise<Result<SolNativeOwnerInfo, Error>> => {
    const accountInfo = await Node.getConnection()
      .getParsedAccountInfo(owner)
      .then(Result.ok)
      .catch(Result.err);

    if (accountInfo.isErr) {
      return Result.err(accountInfo.error);
    }

    const info = {
      sol: 0,
      lamports: 0,
      owner: owner.toString(),
    };

    if (accountInfo.value.value) {
      info.lamports = accountInfo.value.value?.lamports;
      info.sol = accountInfo.value.value?.lamports / LAMPORTS_PER_SOL;
    }
    return Result.ok(info);
  };
}
