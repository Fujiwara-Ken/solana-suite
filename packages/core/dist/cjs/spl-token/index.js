"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplToken = void 0;
const burn_1 = require("./burn");
const find_1 = require("./find");
const history_1 = require("./history");
const mint_1 = require("./mint");
const transfer_1 = require("./transfer");
exports.SplToken = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, burn_1.SplToken), history_1.SplToken), find_1.SplToken), mint_1.SplToken), transfer_1.SplToken);
