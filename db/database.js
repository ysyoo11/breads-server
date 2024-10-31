import { Sequelize } from 'sequelize';

import { config } from '../config.js';

const { host, user, database, password, port } = config.db;
export const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  port,
  logging: false,
});
