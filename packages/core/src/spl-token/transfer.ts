import { createTransferCheckedInstruction } from '@solana/spl-token';
import { PublicKey, Signer, Transaction } from '@solana/web3.js';

import {
  Node,
  Result,
  Instruction,
  PartialSignInstruction,
} from '@solana-suite/shared';

import { Internals } from '../internals/_index';
import { Internals_SplToken } from '../internals/_spl-token';

export namespace SplToken {
  export const transfer = async (
    mint: PublicKey,
    owner: PublicKey,
    dest: PublicKey,
    signers: Signer[],
    amount: number,
    mintDecimal: number,
    feePayer?: Signer
  ): Promise<Result<Instruction, Error>> => {
    !feePayer && (feePayer = signers[0]);

    const sourceToken = await Internals.retryGetOrCreateAssociatedAccountInfo(
      mint,
      owner,
      feePayer
    );

    if (sourceToken.isErr) {
      return Result.err(sourceToken.error);
    }

    const destToken = await Internals.retryGetOrCreateAssociatedAccountInfo(
      mint,
      dest,
      feePayer
    );

    if (destToken.isErr) {
      return Result.err(destToken.error);
    }

    const inst = createTransferCheckedInstruction(
      sourceToken.value.toPublicKey(),
      mint,
      destToken.value.toPublicKey(),
      owner,
      Internals_SplToken.calculateAmount(amount, mintDecimal),
      mintDecimal,
      signers
    );

    return Result.ok(new Instruction([inst], signers, feePayer));
  };

  export const feePayerPartialSignTransfer = async (
    mint: PublicKey,
    owner: PublicKey,
    dest: PublicKey,
    signers: Signer[],
    amount: number,
    mintDecimal: number,
    feePayer: PublicKey
  ): Promise<Result<PartialSignInstruction, Error>> => {
    const sourceToken =
      await Internals_SplToken.getOrCreateAssociatedTokenAccountInstruction(
        mint,
        owner,
        feePayer
      );

    const destToken =
      await Internals_SplToken.getOrCreateAssociatedTokenAccountInstruction(
        mint,
        dest,
        feePayer
      );

    if (destToken.isErr) {
      return Result.err(destToken.error);
    }

    let inst2;
    const blockhashObj = await Node.getConnection().getLatestBlockhash();

    const tx = new Transaction({
      lastValidBlockHeight: blockhashObj.lastValidBlockHeight,
      blockhash: blockhashObj.blockhash,
      feePayer,
    });

    // return associated token account
    if (!destToken.value.inst) {
      inst2 = createTransferCheckedInstruction(
        sourceToken.unwrap().tokenAccount.toPublicKey(),
        mint,
        destToken.value.tokenAccount.toPublicKey(),
        owner,
        Internals_SplToken.calculateAmount(amount, mintDecimal),
        mintDecimal,
        signers
      );
      tx.add(inst2);
    } else {
      // return instruction and undecided associated token account
      inst2 = createTransferCheckedInstruction(
        sourceToken.unwrap().tokenAccount.toPublicKey(),
        mint,
        destToken.value.tokenAccount.toPublicKey(),
        owner,
        Internals_SplToken.calculateAmount(amount, mintDecimal),
        mintDecimal,
        signers
      );
      tx.add(destToken.value.inst).add(inst2);
    }

    tx.recentBlockhash = blockhashObj.blockhash;
    signers.forEach((signer) => {
      tx.partialSign(signer);
    });

    try {
      const serializedTx = tx.serialize({
        requireAllSignatures: false,
      });
      const hex = serializedTx.toString('hex');
      return Result.ok(new PartialSignInstruction(hex));
    } catch (ex) {
      return Result.err(ex as Error);
    }
  };
}
