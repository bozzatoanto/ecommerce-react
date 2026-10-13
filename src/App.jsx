import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import CheckoutModal from "./components/CheckoutModal.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

const STORAGE_KEY = "noma-cart";

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [carrito, setCarrito] = useState(cargarCarrito);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  const cantidadTotal = useMemo(
    () => carrito.reduce((total, item) => total + item.cantidad, 0),
    [carrito]
  );

  function agregarAlCarrito(producto) {
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);

      if (existente) {
        return actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) }
            : item
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });

    setMensaje(`${producto.nombre} se agrego al carrito`);
    window.setTimeout(() => setMensaje(""), 2200);
  }

  function cambiarCantidad(id, cantidad) {
    setCarrito((actual) =>
      actual.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock)) }
          : item
      )
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  function abrirCheckout() {
    setCarritoAbierto(false);
    setCheckoutAbierto(true);
  }

  function compraConfirmada() {
    vaciarCarrito();
  }

  return (
    <div className="app-shell">
      <Header
        cantidad={cantidadTotal}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home onAgregar={agregarAlCarrito} />} />
          <Route path="/productos" element={<Products onAgregar={agregarAlCarrito} />} />
          <Route path="/producto/:id" element={<ProductDetail onAgregar={agregarAlCarrito} />} />
        </Routes>
      </main>

      <CartDrawer
        abierto={carritoAbierto}
        carrito={carrito}
        onCerrar={() => setCarritoAbierto(false)}
        onCambiarCantidad={cambiarCantidad}
        onEliminar={eliminarDelCarrito}
        onCheckout={abrirCheckout}
      />

      <CheckoutModal
        abierto={checkoutAbierto}
        carrito={carrito}
        onCerrar={() => setCheckoutAbierto(false)}
        onCompraConfirmada={compraConfirmada}
      />

      {mensaje && <div className="toast">{mensaje}</div>}
    </div>
  );
}
