import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { obtenerCategorias, obtenerProductos } from "../services/api.js";

export default function Products({ onAgregar }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCategorias()
      .then(setCategorias)
      .catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    setCargando(true);
    setError("");

    obtenerProductos(categoria)
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [categoria]);

  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return productos;
    }

    return productos.filter((producto) =>
      `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
        .toLowerCase()
        .includes(termino)
    );
  }, [productos, busqueda]);

  return (
    <section className="catalog-page container">
      <div className="catalog-header">
        <div>
          <span className="eyebrow">Coleccion completa</span>
          <h1>Productos</h1>
          <p>Filtra por categoria o busca la prenda que necesitas.</p>
        </div>

        <div className="search-box">
          <input
            type="search"
            placeholder="Buscar productos"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </div>
      </div>

      <div className="filter-row">
        {["Todos", ...categorias].map((item) => (
          <button
            key={item}
            className={categoria === item ? "filter-button active" : "filter-button"}
            onClick={() => setCategoria(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="catalog-meta">
        <span>{visibles.length} productos</span>
        <span>Categoria: {categoria}</span>
      </div>

      {cargando ? (
        <p className="state-message">Cargando productos...</p>
      ) : error ? (
        <p className="state-message">{error}</p>
      ) : visibles.length === 0 ? (
        <p className="state-message">No encontramos productos con ese filtro.</p>
      ) : (
        <div className="product-grid">
          {visibles.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      )}
    </section>
  );
}
