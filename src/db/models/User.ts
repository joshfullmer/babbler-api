import { DataTypes, Model } from "sequelize";

import { sequelize } from '..';

interface UserAttributes {
  username: string;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>('user', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

export { User };