import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,     // flipkart
  process.env.DB_USER,     // root
  process.env.DB_PASSWORD, // your password
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  }
);
export default sequelize;