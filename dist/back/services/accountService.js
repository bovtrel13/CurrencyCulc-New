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
exports.getUsername = exports.loginUser = exports.registerUser = void 0;
const Account_1 = __importDefault(require("../models/Account"));
const registerUser = (username, login, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAccount = yield Account_1.default.findOne({ where: { login } });
    if (existingAccount) {
        return { status: 400, data: { error: 'Логин уже используется' } };
    }
    const newUser = yield Account_1.default.create({ username, login, password });
    return { status: 201, data: { message: 'Пользователь зарегистрирован', user: newUser } };
});
exports.registerUser = registerUser;
const loginUser = (login, password) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Account_1.default.findOne({ where: { login, password } });
    if (!account) {
        return { status: 401, data: { error: 'Неправильный логин или пароль' } };
    }
    return { status: 200, data: { message: 'Авторизация успешна' } };
});
exports.loginUser = loginUser;
const getUsername = (login) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield Account_1.default.findOne({ where: { login } });
    if (!account) {
        return { status: 404, data: { error: 'Пользователь не найден' } };
    }
    return { status: 200, data: { username: account.username } };
});
exports.getUsername = getUsername;
