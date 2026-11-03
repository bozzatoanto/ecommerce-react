# NOMA Ecommerce - Aplicaciones Web II

**Autora: Antonella Bozzato**

Proyecto de e-commerce de indumentaria desarrollado para Aplicaciones Web II. La aplicación utiliza una estructura monorepo con frontend en React y backend en Express.js.

## Estructuras de datos

El proyecto trabaja con tres estructuras JSON relacionadas:

- `usuarios.json`
- `productos.json`
- `ordenes.json`

Las órdenes guardan `id_usuario` para relacionar cada compra con un usuario registrado y `id_producto` para relacionar los productos comprados con el catálogo.

## Estructura del proyecto

```text
backend/
  data/
    usuarios.json
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

## Funcionalidades

- Listado de productos.
- Filtro por categoría.
- Buscador de productos.
- Vista individual de producto.
- Carrito con persistencia en localStorage.
- Registro de usuarios.
- Inicio y cierre de sesión.
- Validación de email y contraseña.
- Contraseñas almacenadas mediante hash con bcrypt.
- Checkout asociado al usuario autenticado.
- Creación de órdenes desde el frontend.
- Validación de stock.
- Actualización de stock luego de una compra.
- Persistencia de órdenes en JSON.

## Instalación

```bash
npm install
```

## Ejecución

Frontend y backend:

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

También pueden ejecutarse por separado:

```bash
npm run server
npm run dev
```

## Rutas

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api` | Información de la API |
| GET | `/api/productos` | Lista todos los productos |
| GET | `/api/productos?categoria=Remeras` | Filtra productos por categoría |
| GET | `/api/productos/:id` | Obtiene un producto por ID |
| GET | `/api/categorias` | Lista las categorías |
| GET | `/api/usuarios/:id` | Obtiene un usuario sin exponer la contraseña |
| POST | `/api/usuarios/registro` | Registra un usuario y hashea su contraseña |
| POST | `/api/usuarios/login` | Valida email y contraseña |
| GET | `/api/ordenes/:id` | Consulta una orden |
| POST | `/api/ordenes` | Genera una orden vinculada a un usuario |

## Registro de usuario

```json
{
  "nombre": "Lucia",
  "apellido": "Fernandez",
  "email": "lucia@email.com",
  "contrasena": "lucia123"
}
```

La contraseña no se guarda en texto plano. El backend utiliza bcrypt para generar el hash antes de almacenar el usuario.

## Inicio de sesión

```json
{
  "email": "lucia@email.com",
  "contrasena": "lucia123"
}
```

## Generar una orden

```json
{
  "id_usuario": 1,
  "direccion": "Calle 123, Cordoba",
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

El servidor valida que el usuario exista, verifica el stock de los productos, calcula el total, genera la orden y actualiza el stock.

## Tecnologías

- React
- React Router DOM
- JavaScript
- CSS
- Vite
- Node.js
- Express.js
- bcrypt
- localStorage
- JSON
