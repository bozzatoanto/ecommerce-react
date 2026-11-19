import { readFile } from "node:fs/promises";
import { connectToDatabase } from "./db/connection.js";
import Product from "./db/schemas/product.schema.js";

const productosRuta = new URL("./data/productos.json", import.meta.url);

async function migrar() {
  await connectToDatabase();

  const existentes = await Product.find();

  if (existentes.length > 0) {
    console.log("La coleccion products ya contiene datos");
    process.exit(0);
  }

  const contenido = await readFile(productosRuta, "utf-8");
  const productos = JSON.parse(contenido);

  for (const producto of productos) {
    const {
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      imagen,
      disponible
    } = producto;

    const nuevoProducto = new Product({
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      imagen,
      disponible
    });

    await nuevoProducto.save();
  }

  console.log("Productos migrados a MongoDB");
  process.exit(0);
}

migrar().catch((error) => {
  console.error(error);
  process.exit(1);
});
