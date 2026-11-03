import { useState } from "react";
import { iniciarSesion, registrarUsuario } from "../services/api.js";

export default function AuthModal({ abierto, onCerrar, onAutenticado }) {
  const [modo, setModo] = useState("login");
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: ""
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  if (!abierto) {
    return null;
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    setError("");
  }

  async function enviar(evento) {
    evento.preventDefault();
    setCargando(true);
    setError("");

    try {
      const respuesta =
        modo === "registro"
          ? await registrarUsuario(formulario)
          : await iniciarSesion({
              email: formulario.email,
              contrasena: formulario.contrasena
            });

      onAutenticado(respuesta.usuario);
      setFormulario({
        nombre: "",
        apellido: "",
        email: "",
        contrasena: ""
      });
      onCerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <section className="checkout-modal auth-modal">
        <button className="icon-button modal-close" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>

        <div className="checkout-heading">
          <span className="eyebrow">Mi cuenta</span>
          <h2>{modo === "login" ? "Ingresar" : "Crear cuenta"}</h2>
          <p>
            {modo === "login"
              ? "Inicia sesion para continuar con tu compra."
              : "Registrate para guardar tus compras asociadas a tu usuario."}
          </p>
        </div>

        <div className="auth-switch">
          <button
            className={modo === "login" ? "active" : ""}
            onClick={() => cambiarModo("login")}
            type="button"
          >
            Ingresar
          </button>
          <button
            className={modo === "registro" ? "active" : ""}
            onClick={() => cambiarModo("registro")}
            type="button"
          >
            Registrarme
          </button>
        </div>

        <form className="checkout-form" onSubmit={enviar}>
          {modo === "registro" && (
            <>
              <label>
                Nombre
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                  required
                />
              </label>

              <label>
                Apellido
                <input
                  type="text"
                  name="apellido"
                  value={formulario.apellido}
                  onChange={cambiarCampo}
                  required
                />
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={cambiarCampo}
              required
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              name="contrasena"
              minLength="6"
              value={formulario.contrasena}
              onChange={cambiarCampo}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button full-width" disabled={cargando}>
            {cargando
              ? "Procesando..."
              : modo === "login"
                ? "Ingresar"
                : "Crear cuenta"}
          </button>
        </form>
      </section>
    </div>
  );
}
