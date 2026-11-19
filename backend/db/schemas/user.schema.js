import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const UserSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = models.users || model("users", UserSchema);

export default User;
