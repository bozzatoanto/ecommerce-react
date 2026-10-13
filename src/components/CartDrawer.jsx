import { formatearPrecio } from "../utils/formato.js";

export default function CartDrawer({
  abierto,
  carrito,
  onCerrar,
  onCambiarCantidad,
  onEliminar,
  onCheckout
}) {
  const total = carrito.reduce(
    (acumulado, item) => acumulado + item.precio * item.cantidad,
    0
  );

  return (
    <>
      <div
        className={`drawer-overlay ${abierto ? "visible" : ""}`}
        onClick={onCerrar}
      />

      <aside className={`cart-drawer ${abierto ? "open" : ""}`}>
        <div className="cart-header">
          <div>
            <span className="eyebrow">Tu seleccion</span>
            <h2>Carrito</h2>
          </div>
          <button className="icon-button" onClick={onCerrar} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        <div className="cart-content">
          {carrito.length === 0 ? (
            <div className="empty-state">
              <p>Tu carrito esta vacio.</p>
              <button className="secondary-button" onClick={onCerrar}>
                Seguir comprando
              </button>
            </div>
          ) : (
            carrito.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.imagen} alt={item.nombre} />
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <h3>{item.nombre}</h3>
                      <p>{formatearPrecio(item.precio)}</p>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => onEliminar(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="quantity-control">
                    <button
                      onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
                    >
                      −
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {carrito.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>{formatearPrecio(total)}</strong>
            </div>
            <button className="primary-button full-width" onClick={onCheckout}>
              Finalizar compra
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
