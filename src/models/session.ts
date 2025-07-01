import { DataTypes } from 'sequelize';
import sequelize from '@/lib/sequelize';

const Session = sequelize.define('Session', {
  sessionId: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Session;