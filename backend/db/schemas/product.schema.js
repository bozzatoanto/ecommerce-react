import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const ProductSchema = new Schema(
  {
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    imagen: { type: String, required: true },
    disponible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = models.products || model("products", ProductSchema);

export default Product;
