import Product from "../model/productSchema.js";

export const getProducts = async (req, res) => {
  try {
    const data = await Product.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const data = await Product.findByPk(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};