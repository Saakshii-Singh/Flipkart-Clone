import { DataTypes } from "sequelize";
import sequelize from "../Connection/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 20],
    },
  },

  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 20],
    },
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
  },
});

export default User;