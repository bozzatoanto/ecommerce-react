import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export const verificarToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authorization.split(" ")[1];

  try {
    const result = jwt.verify(token, SECRET);
    req.usuario = result;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido" });
  }
};
