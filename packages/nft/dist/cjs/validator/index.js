"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorError = exports.Validator = void 0;
const shared_1 = require("@solana-suite/shared");
const metaplex_1 = require("../metaplex");
var Validator;
(function (Validator) {
    let Message;
    (function (Message) {
        Message.SUCCESS = 'success';
        Message.SMALL_NUMBER = 'too small';
        Message.BIG_NUMBER = 'too big';
        Message.LONG_LENGTH = 'too long';
        Message.EMPTY = 'invalid empty value';
        Message.INVALID_URL = 'invalid url';
    })(Message = Validator.Message || (Validator.Message = {}));
    Validator.NAME_LENGTH = 32;
    Validator.SYMBOL_LENGTH = 10;
    Validator.URL_LENGTH = 200;
    Validator.ROYALTY_MAX = 100;
    Validator.SELLER_FEE_BASIS_POINTS_MAX = 10000;
    Validator.ROYALTY_MIN = 0;
    Validator.isRoyalty = (royalty) => {
        const key = 'royalty';
        if (!royalty) {
            return shared_1.Result.err(createError(key, Message.EMPTY, royalty));
        }
        if (royalty < Validator.ROYALTY_MIN) {
            return shared_1.Result.err(createError(key, Message.SMALL_NUMBER, royalty, {
                threshold: Validator.ROYALTY_MIN,
                condition: 'underMin',
            }));
        }
        else if (royalty > Validator.ROYALTY_MAX) {
            return shared_1.Result.err(createError(key, Message.BIG_NUMBER, royalty, {
                threshold: Validator.ROYALTY_MAX,
                condition: 'overMax',
            }));
        }
        return shared_1.Result.ok(Message.SUCCESS);
    };
    Validator.isSellerFeeBasisPoints = (royalty) => {
        const key = 'sellerFeeBasisPoints/seller_fee_basis_points';
        if (!royalty) {
            return shared_1.Result.err(createError(key, Message.EMPTY, royalty));
        }
        if (royalty < Validator.ROYALTY_MIN) {
            return shared_1.Result.err(createError(key, Message.SMALL_NUMBER, royalty, {
                threshold: Validator.ROYALTY_MIN,
                condition: 'underMin',
            }));
        }
        else if (royalty > Validator.ROYALTY_MAX * metaplex_1.MetaplexRoyalty.THRESHOLD) {
            return shared_1.Result.err(createError(key, Message.BIG_NUMBER, royalty, {
                threshold: Validator.SELLER_FEE_BASIS_POINTS_MAX,
                condition: 'overMax',
            }));
        }
        return shared_1.Result.ok(Message.SUCCESS);
    };
    Validator.isName = (name) => {
        const key = 'name';
        if (!name) {
            return shared_1.Result.err(createError(key, Message.EMPTY, name));
        }
        if (byteLength(name) > Validator.NAME_LENGTH) {
            return shared_1.Result.err(createError(key, Message.LONG_LENGTH, name, {
                threshold: Validator.NAME_LENGTH,
                condition: 'overMax',
            }));
        }
        return shared_1.Result.ok(Message.SUCCESS);
    };
    Validator.isSymbol = (symbol) => {
        const key = 'symbol';
        if (!symbol) {
            return shared_1.Result.err(createError(key, Message.EMPTY, symbol));
        }
        if (byteLength(symbol) > Validator.SYMBOL_LENGTH) {
            return shared_1.Result.err(createError(key, Message.LONG_LENGTH, symbol, {
                threshold: Validator.SYMBOL_LENGTH,
                condition: 'overMax',
            }));
        }
        return shared_1.Result.ok(Message.SUCCESS);
    };
    Validator.isFilePath = (filePath) => {
        const key = 'filePath';
        if (!filePath) {
            return shared_1.Result.err(createError(key, Message.EMPTY, filePath));
        }
        return shared_1.Result.ok(Message.SUCCESS);
    };
    Validator.isUri = (uri) => isUriOrImage(uri, 'uri');
    Validator.isImageUrl = (image) => isUriOrImage(image, 'image');
    Validator.checkAll = (metadata) => {
        const keys = Object.keys(metadata);
        const results = [];
        keys.map((key) => {
            let res;
            switch (key) {
                case 'uri':
                    if (key in metadata) {
                        res = Validator.isUri(metadata.uri);
                    }
                    break;
                case 'image':
                    if (key in metadata) {
                        res = Validator.isImageUrl(metadata.image);
                    }
                    break;
                case 'royalty':
                    if (key in metadata) {
                        res = Validator.isRoyalty(metadata.royalty);
                    }
                    break;
                case 'seller_fee_basis_points':
                    if (key in metadata) {
                        res = Validator.isSellerFeeBasisPoints(metadata.seller_fee_basis_points);
                    }
                    break;
                case 'sellerFeeBasisPoints':
                    if (key in metadata) {
                        res = Validator.isSellerFeeBasisPoints(metadata.sellerFeeBasisPoints);
                    }
                    break;
                case 'name':
                    res = Validator.isName(metadata.name);
                    break;
                case 'symbol':
                    res = Validator.isSymbol(metadata.symbol);
                    break;
                case 'filePath':
                    if (key in metadata) {
                        res = Validator.isFilePath(metadata.filePath);
                    }
                    break;
            }
            if (res && res.isErr) {
                results.push(...res.error.details);
            }
        });
        if (results.length > 0) {
            const message = 'Caught in the validation errors';
            return shared_1.Result.err(new ValidatorError(message, results));
        }
        return shared_1.Result.ok(Message.SUCCESS);
    };
    const byteLength = (value) => {
        const text = new TextEncoder();
        return text.encode(value).length;
    };
    const createError = (key, message, actual, limit) => {
        let error;
        if (limit) {
            error = new ValidatorError(message, [{ key, message, actual, limit }]);
        }
        else {
            error = new ValidatorError(message, [{ key, message, actual }]);
        }
        return error;
    };
    const isUriOrImage = (imageOrUri, key) => {
        if (!imageOrUri) {
            return shared_1.Result.err(createError(key, Message.EMPTY, imageOrUri));
        }
        if (byteLength(imageOrUri) > Validator.URL_LENGTH) {
            return shared_1.Result.err(createError(key, Message.LONG_LENGTH, imageOrUri, {
                threshold: Validator.URL_LENGTH,
                condition: 'overMax',
            }));
        }
        if (!/https?:\/\/[-_.!~*\\()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g.test(imageOrUri)) {
            return shared_1.Result.err(createError(key, Message.INVALID_URL, imageOrUri));
        }
        return shared_1.Result.ok(Message.SUCCESS);
    };
})(Validator = exports.Validator || (exports.Validator = {}));
class ValidatorError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
    }
}
exports.ValidatorError = ValidatorError;
