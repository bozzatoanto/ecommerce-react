# NOMA Ecommerce - Aplicaciones Web II

**Autora: Antonella Bozzato**

Proyecto de e-commerce de indumentaria desarrollado para Aplicaciones Web II.

La cuarta entrega incorpora persistencia con MongoDB, operaciones CRUD con Mongoose y autenticación de usuarios mediante JWT y bcrypt.

## Arquitectura

El proyecto utiliza una estructura monorepo:

```text
backend/
  db/
    actions/
      order.actions.js
      product.actions.js
      user.actions.js
    schemas/
      order.schema.js
      product.schema.js
      user.schema.js
    connection.js
  routes/
    orders.routes.js
    products.routes.js
    users.routes.js
  data/
    productos.json
  index.js
  middlewares.js
  migrar.js

src/
  components/
  pages/
  services/
  styles/
  utils/
```

El frontend está desarrollado con React y Vite. El servidor utiliza Express.js. La información se persiste en MongoDB mediante Mongoose.

## Tecnologías

- React
- React Router DOM
- JavaScript
- CSS
- Vite
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- localStorage

## Dependencias principales

- `express`
- `mongoose`
- `jsonwebtoken`
- `bcrypt`
- `cors`
- `react`
- `react-dom`
- `react-router-dom`

## Configuración

Crear un archivo `.env` en la raíz del proyecto usando como referencia `.env.example`.

```text
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=NOMA
JWT_SECRET=TU_SECRET
```

`JWT_SECRET` debe reemplazarse por un valor propio y no debe subirse al repositorio.

## Instalación

```bash
npm install
```

## Migración inicial

Los productos de la entrega anterior se mantienen en `backend/data/productos.json` únicamente como origen de la migración.

Con MongoDB ejecutándose:

```bash
npm run migrate
```

Este comando crea los productos iniciales en MongoDB si la colección todavía está vacía.

El funcionamiento normal de la aplicación no lee ni escribe archivos JSON.

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

## MongoDB

Se utilizan tres esquemas principales:

### Usuario

- nombre
- apellido
- email
- contrasena
- activo

La contraseña se almacena encriptada mediante bcrypt.

### Producto

- nombre
- descripcion
- categoria
- precio
- stock
- imagen
- disponible

### Orden

- usuario
- direccion
- productos
- total
- estado

El campo `usuario` referencia al esquema de usuarios.

Cada elemento de `productos` contiene una referencia al esquema de productos.

Las consultas de órdenes utilizan `populate` para recuperar los datos relacionados.

## Autenticación

### Registro

```http
POST /api/usuarios/create
```

```json
{
  "nombre": "Lucia",
  "apellido": "Fernandez",
  "email": "lucia@email.com",
  "contrasena": "lucia123"
}
```

Antes de guardar el usuario, bcrypt genera el hash de la contraseña.

### Login

```http
POST /api/usuarios/login
```

```json
{
  "email": "lucia@email.com",
  "contrasena": "lucia123"
}
```

Si las credenciales son correctas, el servidor devuelve un JWT.

El frontend guarda la sesión y utiliza el token para realizar una compra.

## Ruta protegida

La creación de una orden requiere:

```text
Authorization: Bearer TOKEN
```

El middleware verifica el token mediante `jwt.verify`.

## CRUD de productos

| Operación | Método | Ruta |
| --- | --- | --- |
| Create | POST | `/api/productos/create` |
| Read | GET | `/api/productos/all` |
| Read por ID | GET | `/api/productos/byId/:id` |
| Read por categoría | GET | `/api/productos/byCategory/:categoria` |
| Update | PUT | `/api/productos/update/:id` |
| Delete | DELETE | `/api/productos/delete/:id` |

## Órdenes

| Método | Ruta | Protección |
| --- | --- | --- |
| GET | `/api/ordenes/all` | JWT |
| GET | `/api/ordenes/byId/:id` | JWT |
| POST | `/api/ordenes/create` | JWT |
| PUT | `/api/ordenes/update/:id` | JWT |
| DELETE | `/api/ordenes/delete/:id` | JWT |

## Funcionalidades del frontend

- Listado de productos desde MongoDB.
- Filtro por categoría.
- Buscador.
- Detalle de producto.
- Carrito persistido en localStorage.
- Registro de usuario.
- Login.
- Sesión persistida.
- Compra protegida mediante JWT.
- Creación de orden en MongoDB.
- Actualización de stock después de comprar.

## Documentación de entrega

- `ENTREGA_TP4.md`
- `PRUEBAS_POSTMAN.md`
- `GUIA_VIDEO_TP4.md`
