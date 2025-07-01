import { DataTypes } from 'sequelize';
import sequelize from '@/lib/sequelize';


const Link = sequelize.define('Links', {
  short: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
  },
  original: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  traffic: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Link;

import User from './user';

Link.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Link, { foreignKey: 'userId' });
