import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById
} from "../db/actions/user.actions.js";
import { verificarToken } from "../middlewares.js";

const router = Router();
const SECRET = process.env.JWT_SECRET;

function usuarioPublico(usuario) {
  return {
    _id: usuario._id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    activo: usuario.activo
  };
}

router.post("/create", async (req, res) => {
  const { nombre, apellido, email, contrasena } = req.body;

  if (!nombre || !apellido || !email || !contrasena) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (contrasena.length < 6) {
    return res.status(400).json({
      error: "La contrasena debe tener al menos 6 caracteres"
    });
  }

  try {
    const emailNormalizado = email.trim().toLowerCase();
    const existente = await findUserByEmail(emailNormalizado);

    if (existente) {
      return res.status(409).json({ error: "El email ya esta registrado" });
    }

    const hashedPass = bcrypt.hashSync(contrasena, 8);

    const usuario = await createUser({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: emailNormalizado,
      contrasena: hashedPass,
      activo: true
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: usuarioPublico(usuario)
    });
  } catch {
    res.status(400).json({ error: "No se pudo registrar el usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: "Email y contrasena son obligatorios" });
  }

  try {
    const usuario = await findUserByEmail(email.trim().toLowerCase());

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const controlPass = bcrypt.compareSync(contrasena, usuario.contrasena);

    if (!controlPass) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    if (!usuario.activo) {
      return res.status(403).json({ error: "Usuario inactivo" });
    }

    const token = jwt.sign(
      { _id: usuario._id, email: usuario.email },
      SECRET,
      { expiresIn: 8640 }
    );

    res.status(200).json({
      usuario: usuarioPublico(usuario),
      token
    });
  } catch {
    res.status(400).json({ error: "No se pudo iniciar sesion" });
  }
});

router.get("/byId/:id", verificarToken, async (req, res) => {
  try {
    const usuario = await findUserById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(usuarioPublico(usuario));
  } catch {
    res.status(400).json({ error: "No se pudo obtener el usuario" });
  }
});

export default router;
