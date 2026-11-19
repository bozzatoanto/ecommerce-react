import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import CheckoutModal from "./components/CheckoutModal.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

const CART_STORAGE_KEY = "noma-cart";
const SESSION_STORAGE_KEY = "noma-session";

function cargarStorage(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function obtenerId(item) {
  return item._id || item.id;
}

export default function App() {
  const [carrito, setCarrito] = useState(() =>
    cargarStorage(CART_STORAGE_KEY, [])
  );
  const [sesion, setSesion] = useState(() =>
    cargarStorage(SESSION_STORAGE_KEY, null)
  );
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [authAbierto, setAuthAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const usuario = sesion?.usuario || null;
  const token = sesion?.token || null;

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (sesion) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sesion));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [sesion]);

  const cantidadTotal = useMemo(
    () => carrito.reduce((total, item) => total + item.cantidad, 0),
    [carrito]
  );

  function mostrarMensaje(texto) {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(""), 2200);
  }

  function agregarAlCarrito(producto) {
    const idProducto = obtenerId(producto);

    setCarrito((actual) => {
      const existente = actual.find(
        (item) => obtenerId(item) === idProducto
      );

      if (existente) {
        return actual.map((item) =>
          obtenerId(item) === idProducto
            ? {
                ...item,
                cantidad: Math.min(item.cantidad + 1, producto.stock)
              }
            : item
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });

    mostrarMensaje(`${producto.nombre} se agrego al carrito`);
  }

  function cambiarCantidad(id, cantidad) {
    setCarrito((actual) =>
      actual.map((item) =>
        obtenerId(item) === id
          ? {
              ...item,
              cantidad: Math.max(1, Math.min(cantidad, item.stock))
            }
          : item
      )
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito((actual) =>
      actual.filter((item) => obtenerId(item) !== id)
    );
  }

  function abrirCheckout() {
    setCarritoAbierto(false);

    if (!sesion) {
      mostrarMensaje("Inicia sesion para finalizar la compra");
      setAuthAbierto(true);
      return;
    }

    setCheckoutAbierto(true);
  }

  function compraConfirmada() {
    setCarrito([]);
  }

  function autenticarUsuario(datosSesion) {
    setSesion(datosSesion);
    mostrarMensaje(`Hola, ${datosSesion.usuario.nombre}`);
  }

  function cerrarSesion() {
    setSesion(null);
    setCheckoutAbierto(false);
    mostrarMensaje("Sesion cerrada");
  }

  return (
    <div className="app-shell">
      <Header
        cantidad={cantidadTotal}
        usuario={usuario}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        onAbrirAuth={() => setAuthAbierto(true)}
        onCerrarSesion={cerrarSesion}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home onAgregar={agregarAlCarrito} />} />
          <Route
            path="/productos"
            element={<Products onAgregar={agregarAlCarrito} />}
          />
          <Route
            path="/producto/:id"
            element={<ProductDetail onAgregar={agregarAlCarrito} />}
          />
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
        usuario={usuario}
        token={token}
        onCerrar={() => setCheckoutAbierto(false)}
        onCompraConfirmada={compraConfirmada}
      />

      <AuthModal
        abierto={authAbierto}
        onCerrar={() => setAuthAbierto(false)}
        onAutenticado={autenticarUsuario}
      />

      {mensaje && <div className="toast">{mensaje}</div>}
    </div>
  );
}
