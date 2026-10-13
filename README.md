# NOMA Ecommerce - Aplicaciones Web II

Tercera entrega de Aplicaciones Web II. El proyecto reutiliza el ecommerce de indumentaria desarrollado previamente en React y lo conecta con un servidor Express.js dentro del mismo repositorio.

## Modelo elegido

Se utiliza un esquema monorepo:

```text
backend/
  data/
    productos.json
    ordenes.json
  servidor.mjs
src/
  components/
  pages/
  services/
  styles/
  utils/
```

El frontend está desarrollado con React y Vite. El backend utiliza Express.js y archivos JSON como persistencia de datos.

## Funcionalidades

- Listado de todos los productos disponibles.
- Filtro de productos por categoría.
- Buscador de productos.
- Vista individual de producto.
- Carrito de compras lateral.
- Aumento y disminución de cantidades.
- Eliminación de productos del carrito.
- Persistencia del carrito mediante localStorage.
- Formulario de checkout con datos del usuario.
- Generación de órdenes de compra mediante una solicitud POST al backend.
- Validación de stock en el servidor.
- Actualización de stock después de confirmar una compra.
- Registro de las órdenes generadas en `backend/data/ordenes.json`.

## Instalación

```bash
npm install
```

## Ejecución

Para iniciar frontend y backend al mismo tiempo:

```bash
npm run dev:full
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3000
```

También se pueden ejecutar por separado:

```bash
npm run server
npm run dev
```

## Rutas del backend

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api` | Información general de la API |
| GET | `/api/productos` | Lista todos los productos |
| GET | `/api/productos?categoria=Remeras` | Filtra productos por categoría |
| GET | `/api/productos/:id` | Obtiene un producto por ID |
| GET | `/api/categorias` | Lista las categorías disponibles |
| GET | `/api/ordenes/:id` | Consulta una orden por ID |
| POST | `/api/ordenes` | Genera una nueva orden de compra |

## Ejemplo de compra

```json
{
  "usuario": {
    "nombre": "Cliente Ejemplo",
    "email": "cliente@email.com",
    "direccion": "Calle 123"
  },
  "productos": [
    {
      "id": 1,
      "cantidad": 2
    },
    {
      "id": 7,
      "cantidad": 1
    }
  ]
}
```

El servidor obtiene los precios desde el catálogo, valida el stock, calcula el total, genera el ID de la orden y guarda la compra.

## Tecnologías

- React
- React Router DOM
- JavaScript
- CSS
- Vite
- Node.js
- Express.js
- localStorage
- JSON
