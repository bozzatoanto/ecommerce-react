import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { obtenerProductos } from "../services/api.js";

export default function Home({ onAgregar }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerProductos()
      .then((datos) => setProductos(datos.slice(0, 4)))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Nueva temporada</span>
            <h1>Esenciales que combinan con todo.</h1>
            <p>
              Prendas urbanas, simples y versatiles pensadas para usar todos los dias.
            </p>
            <Link to="/productos" className="primary-link">
              Ver coleccion
            </Link>
          </div>

          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
              alt="Coleccion de indumentaria"
            />
            <div className="hero-note">
              <span>DROP 01</span>
              <strong>Urban essentials</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="category-strip">
        <div className="container category-strip-inner">
          <span>Remeras</span>
          <span>Buzos</span>
          <span>Pantalones</span>
          <span>Accesorios</span>
        </div>
      </section>

      <section className="featured-section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Seleccion</span>
            <h2>Destacados</h2>
          </div>
          <Link to="/productos" className="text-link">
            Ver todos
          </Link>
        </div>

        {error ? (
          <p className="state-message">{error}</p>
        ) : (
          <div className="product-grid">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAgregar={onAgregar}
              />
            ))}
          </div>
        )}
      </section>

      <section className="editorial-banner">
        <div className="container editorial-content">
          <span className="eyebrow light">Compra simple</span>
          <h2>Elegis, sumas al carrito y generamos tu orden.</h2>
          <p>Tu seleccion queda guardada aunque cierres o recargues la pagina.</p>
          <Link to="/productos" className="light-link">
            Explorar productos
          </Link>
        </div>
      </section>
    </>
  );
}
