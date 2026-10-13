import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/formato.js";

export default function ProductCard({ producto, onAgregar }) {
  return (
    <article className="product-card">
      <Link to={`/producto/${producto.id}`} className="product-image-wrap">
        <img src={producto.imagen} alt={producto.nombre} className="product-image" />
      </Link>

      <div className="product-card-body">
        <span className="eyebrow">{producto.categoria}</span>
        <Link to={`/producto/${producto.id}`} className="product-name">
          {producto.nombre}
        </Link>
        <p className="product-price">{formatearPrecio(producto.precio)}</p>
        <button
          className="primary-button"
          disabled={!producto.disponible || producto.stock === 0}
          onClick={() => onAgregar(producto)}
        >
          {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
        </button>
      </div>
    </article>
  );
}
