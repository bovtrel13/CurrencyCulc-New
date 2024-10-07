import { Sequelize } from 'sequelize';

export const sequelizeCurrencies = new Sequelize('postgres', 'postgres', '12082012Bro', {
    host: 'localhost',
    dialect: 'postgres',
});

export const sequelizeAccounts = new Sequelize('postgres', 'postgres', '12082012Bro', {
    host: 'localhost',
    dialect: 'postgres',
});