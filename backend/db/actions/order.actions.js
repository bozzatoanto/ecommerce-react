import { connectToDatabase } from "../connection.js";
import Order from "../schemas/order.schema.js";

export const createOrder = async (data) => {
  await connectToDatabase();
  const order = new Order(data);
  return order.save();
};

export const findAllOrders = async () => {
  await connectToDatabase();
  return Order.find()
    .populate({ path: "usuario", select: "nombre apellido email" })
    .populate({ path: "productos.producto" });
};

export const findOrderById = async (id) => {
  await connectToDatabase();
  return Order.findById(id)
    .populate({ path: "usuario", select: "nombre apellido email" })
    .populate({ path: "productos.producto" });
};

export const updateOrder = async (id, data) => {
  await connectToDatabase();
  await Order.findByIdAndUpdate(id, data);
  return findOrderById(id);
};

export const deleteOrder = async (id) => {
  await connectToDatabase();
  return Order.findByIdAndDelete(id);
};
