import mongoose from "mongoose";

const { Schema, models, model, ObjectId } = mongoose;

const OrderSchema = new Schema(
  {
    usuario: { type: ObjectId, required: true, ref: "users" },
    direccion: { type: String, required: true },
    productos: [
      {
        producto: { type: ObjectId, required: true, ref: "products" },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
        subtotal: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    estado: { type: String, default: "confirmada" }
  },
  { timestamps: true }
);

const Order = models.orders || model("orders", OrderSchema);

export default Order;
