import Product from "./model/productSchema.js";
import { products } from "./constant/data.js";

const DefaultData = async () => {
  try {
    await Product.bulkCreate(products, { ignoreDuplicates: true });
    console.log("Data inserted successfully");
  } catch (error) {
    console.log("Error:", error);
  }
};

export default DefaultData;