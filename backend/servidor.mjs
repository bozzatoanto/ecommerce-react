import express from "express";
import cors from "cors";
import { readFile, writeFile } from "node:fs/promises";

const app = express();
const puerto = 3000;
const productosRuta = new URL("./data/productos.json", import.meta.url);
const ordenesRuta = new URL("./data/ordenes.json", import.meta.url);

app.use(cors());
app.use(express.json());

async function leerJson(ruta) {
  const contenido = await readFile(ruta, "utf-8");
  return JSON.parse(contenido);
}

async function escribirJson(ruta, datos) {
  await writeFile(ruta, JSON.stringify(datos, null, 2) + "\n", "utf-8");
}

app.get("/api", (req, res) => {
  res.json({
    proyecto: "Ecommerce de indumentaria",
    productos: "/api/productos",
    categorias: "/api/categorias",
    ordenes: "/api/ordenes"
  });
});

app.get("/api/productos", async (req, res) => {
  try {
    const productos = await leerJson(productosRuta);
    const categoria = req.query.categoria;

    if (!categoria || categoria.toLowerCase() === "todos") {
      return res.json(productos);
    }

    const filtrados = productos.filter(
      (producto) => producto.categoria.toLowerCase() === categoria.toLowerCase()
    );

    res.json(filtrados);
  } catch {
    res.status(500).json({ error: "No se pudieron obtener los productos" });
  }
});

app.get("/api/productos/:id", async (req, res) => {
  try {
    const productos = await leerJson(productosRuta);
    const producto = productos.find((item) => item.id === Number(req.params.id));

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch {
    res.status(500).json({ error: "No se pudo obtener el producto" });
  }
});

app.get("/api/categorias", async (req, res) => {
  try {
    const productos = await leerJson(productosRuta);
    const categorias = [...new Set(productos.map((producto) => producto.categoria))];
    res.json(categorias);
  } catch {
    res.status(500).json({ error: "No se pudieron obtener las categorias" });
  }
});

app.get("/api/ordenes/:id", async (req, res) => {
  try {
    const ordenes = await leerJson(ordenesRuta);
    const orden = ordenes.find((item) => item.id === req.params.id);

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json(orden);
  } catch {
    res.status(500).json({ error: "No se pudo obtener la orden" });
  }
});

app.post("/api/ordenes", async (req, res) => {
  try {
    const { usuario, productos } = req.body;

    if (
      !usuario?.nombre ||
      !usuario?.email ||
      !usuario?.direccion ||
      !Array.isArray(productos) ||
      productos.length === 0
    ) {
      return res.status(400).json({ error: "Datos de compra incompletos" });
    }

    const [catalogo, ordenes] = await Promise.all([
      leerJson(productosRuta),
      leerJson(ordenesRuta)
    ]);

    const detalle = [];
    let total = 0;

    for (const item of productos) {
      const producto = catalogo.find((registro) => registro.id === Number(item.id));
      const cantidad = Number(item.cantidad);

      if (!producto || !Number.isInteger(cantidad) || cantidad <= 0) {
        return res.status(400).json({ error: "Producto o cantidad invalida" });
      }

      if (cantidad > producto.stock) {
        return res.status(409).json({
          error: `Stock insuficiente para ${producto.nombre}`
        });
      }

      const subtotal = producto.precio * cantidad;
      total += subtotal;

      detalle.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        subtotal
      });
    }

    for (const item of detalle) {
      const producto = catalogo.find((registro) => registro.id === item.id);
      producto.stock -= item.cantidad;
      producto.disponible = producto.stock > 0;
    }

    const orden = {
      id: `ORD-${Date.now()}`,
      fecha: new Date().toISOString(),
      estado: "confirmada",
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        direccion: usuario.direccion
      },
      productos: detalle,
      total
    };

    ordenes.push(orden);

    await Promise.all([
      escribirJson(productosRuta, catalogo),
      escribirJson(ordenesRuta, ordenes)
    ]);

    res.status(201).json(orden);
  } catch {
    res.status(500).json({ error: "No se pudo generar la orden" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(puerto, () => {
  console.log(`Servidor disponible en http://localhost:${puerto}`);
});
