import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../services/api.js";
import { formatearPrecio } from "../utils/formato.js";

export default function ProductDetail({ onAgregar }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerProducto(id)
      .then(setProducto)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <section className="container detail-state">
        <p>{error}</p>
        <Link to="/productos" className="text-link">
          Volver a productos
        </Link>
      </section>
    );
  }

  if (!producto) {
    return <p className="container state-message">Cargando producto...</p>;
  }

  return (
    <section className="product-detail container">
      <div className="detail-image-wrap">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>

      <div className="detail-info">
        <Link to="/productos" className="back-link">
          ← Volver a productos
        </Link>
        <span className="eyebrow">{producto.categoria}</span>
        <h1>{producto.nombre}</h1>
        <p className="detail-price">{formatearPrecio(producto.precio)}</p>
        <p className="detail-description">{producto.descripcion}</p>

        <div className="detail-data">
          <div>
            <span>Stock</span>
            <strong>{producto.stock} unidades</strong>
          </div>
          <div>
            <span>Estado</span>
            <strong>{producto.disponible ? "Disponible" : "Sin stock"}</strong>
          </div>
        </div>

        <button
          className="primary-button detail-button"
          disabled={!producto.disponible}
          onClick={() => onAgregar(producto)}
        >
          {producto.disponible ? "Agregar al carrito" : "Sin stock"}
        </button>
      </div>
    </section>
  );
}
