import { DataTypes } from 'sequelize';
import sequelize from '@/lib/sequelize';

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: /^[A-Za-z\s]+$/i, // only alphabets and whitespace
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255), // hashed password
    allowNull: false,
  },
});

export default User;