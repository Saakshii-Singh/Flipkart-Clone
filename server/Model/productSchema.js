import { DataTypes } from "sequelize";
import sequelize from "../Connection/db.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  shortTitle: DataTypes.STRING,
  longTitle: DataTypes.STRING,
  mrp: DataTypes.INTEGER,
  cost: DataTypes.INTEGER,
  discountPercent: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  extraDiscount: DataTypes.STRING,
  tagline: DataTypes.STRING,
  image: DataTypes.STRING,
});

export default Product;