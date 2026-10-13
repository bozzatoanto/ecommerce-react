async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || "Ocurrio un error");
  }

  return datos;
}

export async function obtenerProductos(categoria = "Todos") {
  const parametro = categoria && categoria !== "Todos"
    ? `?categoria=${encodeURIComponent(categoria)}`
    : "";
  const respuesta = await fetch(`/api/productos${parametro}`);
  return procesarRespuesta(respuesta);
}

export async function obtenerProducto(id) {
  const respuesta = await fetch(`/api/productos/${id}`);
  return procesarRespuesta(respuesta);
}

export async function obtenerCategorias() {
  const respuesta = await fetch("/api/categorias");
  return procesarRespuesta(respuesta);
}

export async function crearOrden(datos) {
  const respuesta = await fetch("/api/ordenes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  return procesarRespuesta(respuesta);
}
