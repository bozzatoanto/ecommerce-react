import { connectToDatabase } from "../connection.js";
import Product from "../schemas/product.schema.js";

export const createProduct = async (data) => {
  await connectToDatabase();
  const product = new Product(data);
  return product.save();
};

export const findAllProducts = async () => {
  await connectToDatabase();
  return Product.find();
};

export const findProductById = async (id) => {
  await connectToDatabase();
  return Product.findById(id);
};

export const findProductsByCategory = async (categoria) => {
  await connectToDatabase();
  return Product.find({ categoria });
};

export const updateProduct = async (id, data) => {
  await connectToDatabase();
  await Product.findByIdAndUpdate(id, data);
  return Product.findById(id);
};

export const deleteProduct = async (id) => {
  await connectToDatabase();
  return Product.findByIdAndDelete(id);
};
