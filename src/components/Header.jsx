import { NavLink } from "react-router-dom";

export default function Header({
  cantidad,
  usuario,
  onAbrirCarrito,
  onAbrirAuth,
  onCerrarSesion
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand">
          NOMA
        </NavLink>

        <nav className="main-nav">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/productos">
            Productos
          </NavLink>
        </nav>

        <div className="header-actions">
          {usuario ? (
            <div className="user-menu">
              <span>Hola, {usuario.nombre}</span>
              <button onClick={onCerrarSesion}>Salir</button>
            </div>
          ) : (
            <button className="account-button" onClick={onAbrirAuth}>
              Ingresar
            </button>
          )}

          <button className="cart-button" onClick={onAbrirCarrito}>
            Carrito
            <span>{cantidad}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
