import { NavLink } from "react-router-dom";

export default function Header({ cantidad, onAbrirCarrito }) {
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

        <button className="cart-button" onClick={onAbrirCarrito}>
          Carrito
          <span>{cantidad}</span>
        </button>
      </div>
    </header>
  );
}
