import { Request, Response } from 'express';
import { registerUser, loginUser, getUsername } from '../services/accountService';

export const registerAccount = async (req: Request, res: Response): Promise<void> => {
    const { username, login, password } = req.body;

    if (!username || !login || !password) {
        res.status(401).json({ error: 'Неправильные данные для регистрации' });
        return;
    }

    try {
        const result = await registerUser(username, login, password);
        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
};

export const loginAccount = async (req: Request, res: Response): Promise<void> => {
    const { login, password } = req.body;

    if (!login || !password) {
        res.status(401).json({ error: 'Неправильные данные для авторизации' });
        return;
    }

    try {
        const result = await loginUser(login, password);
        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при авторизации' });
    }
};


export const fetchUsername = async (req: Request, res: Response) => {
    const login = req.query.login as string;
    try {
        const result = await getUsername(login);
        res.status(result.status).json(result.data);
    } catch (err) {
        res.status(502).json({ error: 'Ошибка при получении данных' });
    }
};