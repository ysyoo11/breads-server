import { DataTypes, Sequelize } from 'sequelize';

import { sequelize } from '../db/database.js';
import { User } from './auth.js';

const Thread = sequelize.define('thread', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Thread.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'updatedAt',
    'userId',
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.imgUrl'), 'imgUrl'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};
const ORDER_DESC = { order: [['createdAt', 'DESC']] };

export async function getAll() {
  return Thread.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsername(username) {
  return Thread.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

export async function getById(id) {
  return Thread.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text, userId) {
  return Thread.create({ text, userId }) //
    .then((data) => getById(data.dataValues.id));
}

export async function update(id, text) {
  return Thread.findByPk(id, INCLUDE_USER) //
    .then((thread) => {
      thread.text = text;
      return thread.save();
    });
}

export async function remove(id) {
  return Thread.findByPk(id) //
    .then((thread) => {
      thread.destroy();
    });
}
