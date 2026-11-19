import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db/connection.js";
import productsRouter from "./routes/products.routes.js";
import usersRouter from "./routes/users.routes.js";
import ordersRouter from "./routes/orders.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    proyecto: "NOMA Ecommerce",
    autora: "Antonella Bozzato",
    baseDeDatos: "MongoDB",
    autenticacion: "JWT y bcrypt"
  });
});

app.use("/api/productos", productsRouter);
app.use("/api/usuarios", usersRouter);
app.use("/api/ordenes", ordersRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor levantado en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
