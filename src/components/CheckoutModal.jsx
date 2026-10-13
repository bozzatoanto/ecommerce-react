import { useMemo, useState } from "react";
import { crearOrden } from "../services/api.js";
import { formatearPrecio } from "../utils/formato.js";

export default function CheckoutModal({
  abierto,
  carrito,
  onCerrar,
  onCompraConfirmada
}) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    direccion: ""
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [orden, setOrden] = useState(null);

  const total = useMemo(
    () => carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [carrito]
  );

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function cerrar() {
    setFormulario({ nombre: "", email: "", direccion: "" });
    setError("");
    setOrden(null);
    onCerrar();
  }

  async function enviarCompra(evento) {
    evento.preventDefault();
    setCargando(true);
    setError("");

    try {
      const respuesta = await crearOrden({
        usuario: formulario,
        productos: carrito.map((item) => ({
          id: item.id,
          cantidad: item.cantidad
        }))
      });
      setOrden(respuesta);
      onCompraConfirmada(respuesta);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  if (!abierto) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <section className="checkout-modal">
        <button className="icon-button modal-close" onClick={cerrar} aria-label="Cerrar">
          ×
        </button>

        {orden ? (
          <div className="success-state">
            <span className="success-mark">✓</span>
            <span className="eyebrow">Compra confirmada</span>
            <h2>Gracias por tu compra</h2>
            <p>Tu orden fue generada correctamente.</p>
            <div className="order-number">{orden.id}</div>
            <p className="success-total">Total: {formatearPrecio(orden.total)}</p>
            <button className="primary-button full-width" onClick={cerrar}>
              Volver a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="checkout-heading">
              <span className="eyebrow">Ultimo paso</span>
              <h2>Finalizar compra</h2>
              <p>Completa tus datos para generar la orden.</p>
            </div>

            <form className="checkout-form" onSubmit={enviarCompra}>
              <label>
                Nombre y apellido
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                  required
                />
              </label>

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
                Direccion de entrega
                <input
                  type="text"
                  name="direccion"
                  value={formulario.direccion}
                  onChange={cambiarCampo}
                  required
                />
              </label>

              <div className="checkout-summary">
                <span>{carrito.length} productos</span>
                <strong>{formatearPrecio(total)}</strong>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button className="primary-button full-width" disabled={cargando}>
                {cargando ? "Generando orden..." : "Confirmar compra"}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
