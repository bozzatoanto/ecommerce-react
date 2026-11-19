# Pruebas Postman - TP4

Base URL:

```text
http://localhost:3000
```

## 1. CREATE - Crear producto

```http
POST /api/productos/create
```

Body JSON:

```json
{
  "nombre": "Campera Denim",
  "descripcion": "Campera de jean azul",
  "categoria": "Camperas",
  "precio": 89900,
  "stock": 5,
  "imagen": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f"
}
```

Guardar el valor de `_id` de la respuesta para las pruebas siguientes.

## 2. READ - Listar productos

```http
GET /api/productos/all
```

## 3. READ - Buscar por ID

```http
GET /api/productos/byId/ID_DEL_PRODUCTO
```

## 4. READ - Filtrar por categoría

```http
GET /api/productos/byCategory/Remeras
```

## 5. UPDATE - Actualizar producto

```http
PUT /api/productos/update/ID_DEL_PRODUCTO
```

Body JSON:

```json
{
  "precio": 92900,
  "stock": 7
}
```

## 6. Registro de usuario

```http
POST /api/usuarios/create
```

Body JSON:

```json
{
  "nombre": "Lucia",
  "apellido": "Fernandez",
  "email": "lucia@email.com",
  "contrasena": "lucia123"
}
```

En MongoDB la contraseña debe aparecer como un hash y no como `lucia123`.

## 7. Login y JWT

```http
POST /api/usuarios/login
```

Body JSON:

```json
{
  "email": "lucia@email.com",
  "contrasena": "lucia123"
}
```

Copiar el valor de `token`.

## 8. Verificar protección JWT

Intentar crear una orden sin encabezado Authorization:

```http
POST /api/ordenes/create
```

Debe responder que el token es requerido.

Luego repetir agregando en Authorization:

```text
Bearer Token
```

Body JSON:

```json
{
  "direccion": "Obispo Trejo 950, Cordoba",
  "productos": [
    {
      "producto": "ID_PRODUCTO_MONGODB",
      "cantidad": 1
    }
  ]
}
```

## 9. Populate

```http
GET /api/ordenes/all
```

Agregar el mismo Bearer Token.

La respuesta debe mostrar la orden con el usuario relacionado y la información del producto relacionada mediante `populate`.

## 10. DELETE - Eliminar producto

```http
DELETE /api/productos/delete/ID_DEL_PRODUCTO
```

Con esto se demuestran las cuatro operaciones CRUD:

- Create
- Read
- Update
- Delete
