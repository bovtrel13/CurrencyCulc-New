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
exports.fetchUsername = exports.loginAccount = exports.registerAccount = void 0;
const accountService_1 = require("../services/accountService");
const registerAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, login, password } = req.body;
    if (!username || !login || !password) {
        res.status(401).json({ error: 'Неправильные данные для регистрации' });
        return;
    }
    try {
        const result = yield (0, accountService_1.registerUser)(username, login, password);
        res.status(result.status).json(result.data);
    }
    catch (err) {
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
});
exports.registerAccount = registerAccount;
const loginAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password } = req.body;
    if (!login || !password) {
        res.status(401).json({ error: 'Неправильные данные для авторизации' });
        return;
    }
    try {
        const result = yield (0, accountService_1.loginUser)(login, password);
        res.status(result.status).json(result.data);
    }
    catch (err) {
        res.status(500).json({ error: 'Ошибка при авторизации' });
    }
});
exports.loginAccount = loginAccount;
const fetchUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const login = req.query.login;
    try {
        const result = yield (0, accountService_1.getUsername)(login);
        res.status(result.status).json(result.data);
    }
    catch (err) {
        res.status(502).json({ error: 'Ошибка при получении данных' });
    }
});
exports.fetchUsername = fetchUsername;
