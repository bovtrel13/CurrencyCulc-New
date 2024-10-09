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
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const body_parser_1 = __importDefault(require("body-parser"));
require("reflect-metadata");
const database_1 = require("./database"); // Импортируем именованный экспорт
const Currency_1 = __importDefault(require("./models/Currency"));
const Account_1 = __importDefault(require("./models/Account"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; // 3000 или любой другой порт по умолчанию;
app.use(cors());
app.use(body_parser_1.default.json());
database_1.sequelize.authenticate()
    .then(() => {
    console.log('Соединение с базой данных успешно установлено...');
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Не удалось подключиться к базе данных:', err);
});
app.post('/accounts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, login, password } = req.body;
        if (!username || !login || !password) {
            res.status(400).json({ error: 'Неправильные данные для регистрации' });
            return;
        }
        const existingAccount = yield Account_1.default.findOne({ where: { login } });
        if (existingAccount) {
            res.status(400).json({ error: 'Логин уже используется' });
            return;
        }
        const newUser = yield Account_1.default.create({ username, login, password });
        res.status(201).json({ message: 'Пользователь зарегистрирован', user: newUser });
    }
    catch (err) {
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
}));
app.get('/currencies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currencies = yield Currency_1.default.findAll();
        const initialItems = currencies.map(row => ({
            text: row.text,
            symbol: row.symbol,
            code: row.code,
            currencyCode: row.currencycode,
            rate: parseFloat(row.rates.toString()),
        }));
        res.json(initialItems);
    }
    catch (err) {
        res.status(500).json({ error: "Ошибка при получении данных с базы" });
    }
}));
app.post('/accounts/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password } = req.body;
    if (!login || !password) {
        res.status(400).json({ error: 'Неправильные данные для авторизации' });
        return;
    }
    try {
        const account = yield Account_1.default.findOne({ where: { login, password } });
        if (!account) {
            res.status(401).json({ error: 'Неправильный логин или пароль' });
            return;
        }
        res.status(200).json({ message: 'Авторизация успешна' });
    }
    catch (err) {
        res.status(500).json({ error: 'Ошибка при авторизации' });
    }
}));
app.get('/getUsername', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const login = req.query.login;
    try {
        const account = yield Account_1.default.findOne({ where: { login } });
        if (account) {
            res.json({ username: account.username });
        }
        else {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
}));
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});
// app.listen(PORT, () => {
//     console.log(`Сервер запущен на порту ${PORT}`);
// });
