"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplToken = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const shared_1 = require("@solana-suite/shared");
const _index_1 = require("../internals/_index");
const _spl_token_1 = require("../internals/_spl-token");
var SplToken;
(function (SplToken) {
    SplToken.transfer = (mint, owner, dest, signers, amount, mintDecimal, feePayer) => __awaiter(this, void 0, void 0, function* () {
        !feePayer && (feePayer = signers[0]);
        const sourceToken = yield _index_1.Internals.retryGetOrCreateAssociatedAccountInfo(mint, owner, feePayer);
        if (sourceToken.isErr) {
            return shared_1.Result.err(sourceToken.error);
        }
        const destToken = yield _index_1.Internals.retryGetOrCreateAssociatedAccountInfo(mint, dest, feePayer);
        if (destToken.isErr) {
            return shared_1.Result.err(destToken.error);
        }
        const inst = (0, spl_token_1.createTransferCheckedInstruction)(sourceToken.value.toPublicKey(), mint, destToken.value.toPublicKey(), owner, _spl_token_1.Internals_SplToken.calculateAmount(amount, mintDecimal), mintDecimal, signers);
        return shared_1.Result.ok(new shared_1.Instruction([inst], signers, feePayer));
    });
    SplToken.feePayerPartialSignTransfer = (mint, owner, dest, signers, amount, mintDecimal, feePayer) => __awaiter(this, void 0, void 0, function* () {
        const sourceToken = yield _spl_token_1.Internals_SplToken.getOrCreateAssociatedTokenAccountInstruction(mint, owner, feePayer);
        const destToken = yield _spl_token_1.Internals_SplToken.getOrCreateAssociatedTokenAccountInstruction(mint, dest, feePayer);
        if (destToken.isErr) {
            return shared_1.Result.err(destToken.error);
        }
        let inst2;
        const blockhashObj = yield shared_1.Node.getConnection().getLatestBlockhash();
        const tx = new web3_js_1.Transaction({
            lastValidBlockHeight: blockhashObj.lastValidBlockHeight,
            blockhash: blockhashObj.blockhash,
            feePayer,
        });
        // return associated token account
        if (!destToken.value.inst) {
            inst2 = (0, spl_token_1.createTransferCheckedInstruction)(sourceToken.unwrap().tokenAccount.toPublicKey(), mint, destToken.value.tokenAccount.toPublicKey(), owner, _spl_token_1.Internals_SplToken.calculateAmount(amount, mintDecimal), mintDecimal, signers);
            tx.add(inst2);
        }
        else {
            // return instruction and undecided associated token account
            inst2 = (0, spl_token_1.createTransferCheckedInstruction)(sourceToken.unwrap().tokenAccount.toPublicKey(), mint, destToken.value.tokenAccount.toPublicKey(), owner, _spl_token_1.Internals_SplToken.calculateAmount(amount, mintDecimal), mintDecimal, signers);
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
            return shared_1.Result.ok(new shared_1.PartialSignInstruction(hex));
        }
        catch (ex) {
            return shared_1.Result.err(ex);
        }
    });
})(SplToken = exports.SplToken || (exports.SplToken = {}));
