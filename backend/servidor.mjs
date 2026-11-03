import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { readFile, writeFile } from "node:fs/promises";

const app = express();
const puerto = 3000;
const productosRuta = new URL("./data/productos.json", import.meta.url);
const ordenesRuta = new URL("./data/ordenes.json", import.meta.url);
const usuariosRuta = new URL("./data/usuarios.json", import.meta.url);

app.use(cors());
app.use(express.json());

async function leerJson(ruta) {
  const contenido = await readFile(ruta, "utf-8");
  return JSON.parse(contenido);
}

async function escribirJson(ruta, datos) {
  await writeFile(ruta, JSON.stringify(datos, null, 2) + "\n", "utf-8");
}

function usuarioPublico(usuario) {
  const { contrasena, ...datos } = usuario;
  return datos;
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get("/api", (req, res) => {
  res.json({
    proyecto: "Ecommerce de indumentaria",
    autora: "Antonella Bozzato",
    productos: "/api/productos",
    categorias: "/api/categorias",
    usuarios: "/api/usuarios/:id",
    registro: "/api/usuarios/registro",
    login: "/api/usuarios/login",
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

app.get("/api/usuarios/:id", async (req, res) => {
  try {
    const usuarios = await leerJson(usuariosRuta);
    const usuario = usuarios.find((item) => item.id === Number(req.params.id));

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuarioPublico(usuario));
  } catch {
    res.status(500).json({ error: "No se pudo obtener el usuario" });
  }
});

app.post("/api/usuarios/registro", async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena } = req.body;

    if (!nombre?.trim() || !apellido?.trim() || !email?.trim() || !contrasena) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!emailValido(email)) {
      return res.status(400).json({ error: "El email no es valido" });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({
        error: "La contrasena debe tener al menos 6 caracteres"
      });
    }

    const usuarios = await leerJson(usuariosRuta);
    const emailNormalizado = email.trim().toLowerCase();

    if (usuarios.some((usuario) => usuario.email === emailNormalizado)) {
      return res.status(409).json({ error: "El email ya esta registrado" });
    }

    const id = usuarios.length
      ? Math.max(...usuarios.map((usuario) => usuario.id)) + 1
      : 1;

    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = {
      id,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: emailNormalizado,
      contrasena: contrasenaHash,
      activo: true,
      fechaRegistro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    await escribirJson(usuariosRuta, usuarios);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: usuarioPublico(nuevoUsuario)
    });
  } catch {
    res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
});

app.post("/api/usuarios/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email?.trim() || !contrasena) {
      return res.status(400).json({ error: "Email y contrasena son obligatorios" });
    }

    const usuarios = await leerJson(usuariosRuta);
    const usuario = usuarios.find(
      (item) => item.email === email.trim().toLowerCase()
    );

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const contrasenaCorrecta = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaCorrecta) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    if (!usuario.activo) {
      return res.status(403).json({ error: "Usuario inactivo" });
    }

    res.json({
      mensaje: "Inicio de sesion correcto",
      usuario: usuarioPublico(usuario)
    });
  } catch {
    res.status(500).json({ error: "No se pudo iniciar sesion" });
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
    const { id_usuario, direccion, productos } = req.body;

    if (
      !Number.isInteger(Number(id_usuario)) ||
      !direccion?.trim() ||
      !Array.isArray(productos) ||
      productos.length === 0
    ) {
      return res.status(400).json({ error: "Datos de compra incompletos" });
    }

    const [catalogo, ordenes, usuarios] = await Promise.all([
      leerJson(productosRuta),
      leerJson(ordenesRuta),
      leerJson(usuariosRuta)
    ]);

    const usuario = usuarios.find(
      (item) => item.id === Number(id_usuario) && item.activo
    );

    if (!usuario) {
      return res.status(400).json({ error: "El usuario no existe o esta inactivo" });
    }

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
        id_producto: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        subtotal
      });
    }

    for (const item of detalle) {
      const producto = catalogo.find(
        (registro) => registro.id === item.id_producto
      );
      producto.stock -= item.cantidad;
      producto.disponible = producto.stock > 0;
    }

    const orden = {
      id: `ORD-${Date.now()}`,
      id_usuario: usuario.id,
      fecha: new Date().toISOString(),
      estado: "confirmada",
      direccion: direccion.trim(),
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
