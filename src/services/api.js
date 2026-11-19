async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || "Ocurrio un error");
  }

  return datos;
}

export async function obtenerProductos(categoria = "Todos") {
  const ruta =
    categoria && categoria !== "Todos"
      ? `/api/productos/byCategory/${encodeURIComponent(categoria)}`
      : "/api/productos/all";

  const respuesta = await fetch(ruta);
  return procesarRespuesta(respuesta);
}

export async function obtenerProducto(id) {
  const respuesta = await fetch(`/api/productos/byId/${id}`);
  return procesarRespuesta(respuesta);
}

export async function obtenerCategorias() {
  const respuesta = await fetch("/api/productos/categories");
  return procesarRespuesta(respuesta);
}

export async function registrarUsuario(datos) {
  const respuesta = await fetch("/api/usuarios/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  return procesarRespuesta(respuesta);
}

export async function iniciarSesion(datos) {
  const respuesta = await fetch("/api/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  return procesarRespuesta(respuesta);
}

export async function crearOrden(datos, token) {
  const respuesta = await fetch("/api/ordenes/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  });

  return procesarRespuesta(respuesta);
}
