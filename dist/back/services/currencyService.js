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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllCurrencies = void 0;
const Currency_1 = __importDefault(require("../models/Currency"));
const fetchAllCurrencies = () => __awaiter(void 0, void 0, void 0, function* () {
    const currencies = yield Currency_1.default.findAll();
    return currencies.map(currency => ({
        text: currency.text,
        symbol: currency.symbol,
        code: currency.code,
        currencyCode: currency.currencycode,
        rate: parseFloat(currency.rates.toString()),
    }));
});
exports.fetchAllCurrencies = fetchAllCurrencies;
