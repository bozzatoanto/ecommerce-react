import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  findProductsByCategory,
  updateProduct
} from "../db/actions/product.actions.js";

const router = Router();

router.get("/all", async (req, res) => {
  try {
    const products = await findAllProducts();
    res.status(200).json(products);
  } catch {
    res.status(400).json({ error: "No se pudieron obtener los productos" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const products = await findAllProducts();
    const categories = [...new Set(products.map((product) => product.categoria))];
    res.status(200).json(categories);
  } catch {
    res.status(400).json({ error: "No se pudieron obtener las categorias" });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch {
    res.status(400).json({ error: "No se pudo obtener el producto" });
  }
});

router.get("/byCategory/:categoria", async (req, res) => {
  try {
    const products = await findProductsByCategory(req.params.categoria);
    res.status(200).json(products);
  } catch {
    res.status(400).json({ error: "No se pudieron filtrar los productos" });
  }
});

router.post("/create", async (req, res) => {
  const { nombre, descripcion, categoria, precio, stock, imagen } = req.body;

  if (
    !nombre ||
    !descripcion ||
    !categoria ||
    typeof precio !== "number" ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    !imagen
  ) {
    return res.status(400).json({ error: "Datos de producto invalidos" });
  }

  try {
    const product = await createProduct({
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      imagen,
      disponible: stock > 0
    });

    res.status(201).json(product);
  } catch {
    res.status(400).json({ error: "No se pudo crear el producto" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.stock !== undefined) {
      if (!Number.isInteger(data.stock) || data.stock < 0) {
        return res.status(400).json({ error: "Stock invalido" });
      }

      data.disponible = data.stock > 0;
    }

    const product = await updateProduct(req.params.id, data);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch {
    res.status(400).json({ error: "No se pudo actualizar el producto" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({
      mensaje: "Producto eliminado correctamente",
      producto: product
    });
  } catch {
    res.status(400).json({ error: "No se pudo eliminar el producto" });
  }
});

export default router;
