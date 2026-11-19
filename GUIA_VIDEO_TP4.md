# Guía para el video explicativo - TP4

Duración recomendada: 7 a 9 minutos.

## 0:00 - 0:45 | Presentación

Decir:

"Soy Antonella Bozzato y este es mi proyecto NOMA para Aplicaciones Web II. Es un ecommerce de indumentaria desarrollado con React en el frontend y Express en el backend. En esta cuarta entrega incorporé MongoDB con Mongoose, autenticación mediante JWT y encriptación de contraseñas con bcrypt."

Mostrar brevemente la home.

## 0:45 - 1:40 | Funcionalidades

Mostrar:

- listado de productos;
- filtro por categoría;
- detalle;
- agregar al carrito;
- localStorage;
- registro e inicio de sesión.

## 1:40 - 2:40 | MongoDB y estructura

Mostrar Visual Studio Code.

Recorrer:

```text
backend/
  db/
    schemas/
    actions/
    connection.js
  routes/
  middlewares.js
  index.js
```

Explicar brevemente:

- `schemas`: estructuras de MongoDB;
- `actions`: operaciones con Mongoose;
- `routes`: endpoints de Express;
- `middlewares.js`: validación de JWT;
- `connection.js`: conexión a MongoDB.

Mostrar MongoDB Compass con las colecciones:

- products;
- users;
- orders.

## 2:40 - 4:30 | CRUD con Postman

Mostrar las cuatro operaciones sobre productos.

### Create

```text
POST /api/productos/create
```

### Read

```text
GET /api/productos/all
```

### Update

```text
PUT /api/productos/update/:id
```

### Delete

```text
DELETE /api/productos/delete/:id
```

Después del Update y Delete, mostrar el cambio en MongoDB Compass o mediante otro GET.

## 4:30 - 5:50 | bcrypt y autenticación

Registrar un usuario.

Mostrar en MongoDB Compass que la contraseña se encuentra hasheada.

Iniciar sesión desde Postman.

Mostrar que el login devuelve:

- usuario;
- token JWT.

No mostrar el valor de `JWT_SECRET`.

## 5:50 - 7:10 | JWT y compra

Primero intentar:

```text
POST /api/ordenes/create
```

sin token.

Mostrar que la API rechaza la acción.

Después agregar el token como Bearer Token y volver a enviar la compra.

Mostrar que la orden se crea correctamente.

## 7:10 - 7:50 | Populate

Ejecutar:

```text
GET /api/ordenes/all
```

con el token.

Explicar que la orden guarda referencias a usuario y productos y que mediante `populate` se recuperan los datos relacionados.

## 7:50 - 8:30 | Cierre

Mostrar nuevamente la aplicación.

Decir:

"Los principales cambios de esta entrega fueron migrar la persistencia desde JSON hacia MongoDB, implementar CRUD con Mongoose y proteger la autenticación mediante bcrypt y JWT. La compra queda asociada al usuario autenticado y las relaciones se recuperan mediante populate."
