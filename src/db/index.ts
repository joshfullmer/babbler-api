import { Sequelize } from 'sequelize';

//TODO figure out the process.env

const sequelize = new Sequelize(`postgres://tom:test123@127.0.0.1:5432/babbler`); // Example for postgres

export { sequelize };