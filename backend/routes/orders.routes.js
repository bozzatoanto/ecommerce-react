import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  findAllOrders,
  findOrderById,
  updateOrder
} from "../db/actions/order.actions.js";
import {
  findProductById,
  updateProduct
} from "../db/actions/product.actions.js";
import { findUserById } from "../db/actions/user.actions.js";
import { verificarToken } from "../middlewares.js";

const router = Router();

router.get("/all", verificarToken, async (req, res) => {
  try {
    const orders = await findAllOrders();
    res.status(200).json(orders);
  } catch {
    res.status(400).json({ error: "No se pudieron obtener las ordenes" });
  }
});

router.get("/byId/:id", verificarToken, async (req, res) => {
  try {
    const order = await findOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.status(200).json(order);
  } catch {
    res.status(400).json({ error: "No se pudo obtener la orden" });
  }
});

router.post("/create", verificarToken, async (req, res) => {
  const { direccion, productos } = req.body;

  if (!direccion || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "Datos de compra incompletos" });
  }

  try {
    const usuario = await findUserById(req.usuario._id);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: "Usuario no valido" });
    }

    const detalle = [];
    let total = 0;

    for (const item of productos) {
      const product = await findProductById(item.producto);
      const cantidad = Number(item.cantidad);

      if (!product || !Number.isInteger(cantidad) || cantidad <= 0) {
        return res.status(400).json({ error: "Producto o cantidad invalida" });
      }

      if (cantidad > product.stock) {
        return res.status(409).json({
          error: `Stock insuficiente para ${product.nombre}`
        });
      }

      const subtotal = product.precio * cantidad;
      total += subtotal;

      detalle.push({
        producto: product._id,
        cantidad,
        precio: product.precio,
        subtotal
      });
    }

    for (const item of detalle) {
      const product = await findProductById(item.producto);
      const stock = product.stock - item.cantidad;

      await updateProduct(product._id, {
        stock,
        disponible: stock > 0
      });
    }

    const order = await createOrder({
      usuario: usuario._id,
      direccion: direccion.trim(),
      productos: detalle,
      total,
      estado: "confirmada"
    });

    const populatedOrder = await findOrderById(order._id);

    res.status(201).json(populatedOrder);
  } catch {
    res.status(400).json({ error: "No se pudo generar la orden" });
  }
});

router.put("/update/:id", verificarToken, async (req, res) => {
  try {
    const order = await updateOrder(req.params.id, req.body);

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.status(200).json(order);
  } catch {
    res.status(400).json({ error: "No se pudo actualizar la orden" });
  }
});

router.delete("/delete/:id", verificarToken, async (req, res) => {
  try {
    const order = await deleteOrder(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.status(200).json({
      mensaje: "Orden eliminada correctamente"
    });
  } catch {
    res.status(400).json({ error: "No se pudo eliminar la orden" });
  }
});

export default router;
