import express, { Request, Response } from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
import "reflect-metadata";
import { sequelize } from './database'; // Импортируем именованный экспорт

import Currency from './models/Currency'; 
import Account from './models/Account';

const app = express();
const PORT = process.env.PORT || 3000; // 3000 или любой другой порт по умолчанию;
app.use(cors());
app.use(bodyParser.json());

sequelize.authenticate()
    .then(() => {
        console.log('Соединение с базой данных успешно установлено...');
            app.listen(PORT, () => {
                console.log(`Сервер запущен на порту ${PORT}`);
            });
        })
    .catch((err: any) => {
        console.error('Не удалось подключиться к базе данных:', err);
});

app.post('/accounts', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, login, password } = req.body;

        if (!username || !login || !password) {
            res.status(400).json({ error: 'Неправильные данные для регистрации' });
            return;
        }

        const existingAccount = await Account.findOne({ where: { login } });
        if (existingAccount) {
            res.status(400).json({ error: 'Логин уже используется' });
            return;
        }

        const newUser = await Account.create({ username, login, password });
        res.status(201).json({ message: 'Пользователь зарегистрирован', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
});


app.get('/currencies', async (req: Request, res: Response) => {
    try {
        const currencies = await Currency.findAll();

        const initialItems = currencies.map(row => ({
            text: row.text,
            symbol: row.symbol,
            code: row.code,
            currencyCode: row.currencycode,
            rate: parseFloat(row.rates.toString()),
        }));

        res.json(initialItems);
    } catch (err) {
        res.status(500).json({ error: "Ошибка при получении данных с базы" });
    }
});

app.post('/accounts/login', async (req: Request, res: Response): Promise<void> => {
    const { login, password } = req.body;

    if (!login || !password) {
        res.status(400).json({ error: 'Неправильные данные для авторизации' });
        return;
    }

    try {
        const account = await Account.findOne({ where: { login, password } });

        if (!account) {
            res.status(401).json({ error: 'Неправильный логин или пароль' });
            return;
        }

        res.status(200).json({ message: 'Авторизация успешна' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при авторизации' });
    }
});


app.get('/getUsername', async (req: Request, res: Response) => {
    const login = req.query.login as string;

    try {
        const account = await Account.findOne({ where: { login } });

        if (account) {
            res.json({ username: account.username });
        } else {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});

app.get('/', (req, res) => {
    res.send('Сервер работает!');
});  
  
// app.listen(PORT, () => {
//     console.log(`Сервер запущен на порту ${PORT}`);
// });
