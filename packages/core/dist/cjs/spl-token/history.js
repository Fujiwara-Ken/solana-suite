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
const shared_1 = require("@solana-suite/shared");
const history_1 = require("../types/history");
const _history_1 = require("../internals/_history");
var SplToken;
(function (SplToken) {
    SplToken.getHistory = (mint, searchPubkey, options) => __awaiter(this, void 0, void 0, function* () {
        if (options === undefined || !Object.keys(options).length) {
            options = {
                limit: 0,
                actionFilter: [],
                directionFilter: undefined,
            };
        }
        const actionFilter = (options === null || options === void 0 ? void 0 : options.actionFilter) !== undefined && options.actionFilter.length > 0
            ? options.actionFilter
            : [history_1.Filter.Transfer, history_1.Filter.TransferChecked];
        const searchKeyAccount = yield (0, spl_token_1.getAssociatedTokenAddress)(mint, searchPubkey, true)
            .then(shared_1.Result.ok)
            .catch(shared_1.Result.err);
        if (searchKeyAccount.isErr) {
            return shared_1.Result.err(searchKeyAccount.error);
        }
        let bufferedLimit = 0;
        if (options.limit && options.limit < 50) {
            bufferedLimit = options.limit * 1.5; // To get more data, threshold
        }
        else {
            bufferedLimit = 10;
            options.limit = 10;
        }
        let hist = [];
        let before;
        while (true) {
            const transactions = yield _history_1.Internals_History.getForAddress(searchKeyAccount.value, bufferedLimit, before);
            (0, shared_1.debugLog)('# getTransactionHistory loop');
            const res = _history_1.Internals_History.filterTransactions(searchPubkey, transactions, actionFilter, true, options.directionFilter);
            hist = hist.concat(res);
            if (hist.length >= options.limit || res.length === 0) {
                hist = hist.slice(0, options.limit);
                break;
            }
            before = hist[hist.length - 1].sig;
        }
        return shared_1.Result.ok(hist);
    });
})(SplToken = exports.SplToken || (exports.SplToken = {}));
