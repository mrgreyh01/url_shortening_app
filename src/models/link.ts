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
});

export default Link;
