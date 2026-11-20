# 4° Entrega del Trabajo Práctico - Aplicaciones Web II

**Alumna:** Antonella Bozzato

## Repositorio

https://github.com/bozzatoanto/ecommerce-react

## Descripción general

NOMA es una aplicación web de e-commerce de indumentaria desarrollada con React para el frontend y Express.js para el backend.

En esta cuarta entrega se reemplazó la persistencia basada en archivos JSON por una base de datos no relacional MongoDB utilizando Mongoose.

También se incorporó autenticación de usuarios mediante bcrypt para la protección de contraseñas y JWT para verificar acciones de usuarios autenticados.

## Arquitectura

Se utiliza un monorepo que contiene frontend y backend.

El backend se encuentra organizado en:

- esquemas de Mongoose;
- acciones de acceso a MongoDB;
- rutas de Express;
- middleware de validación JWT;
- conexión a MongoDB.

Las entidades principales son:

- usuarios;
- productos;
- órdenes.

Las órdenes relacionan usuarios y productos mediante referencias de MongoDB y se utiliza `populate` para recuperar la información relacionada.

## Tecnologías y dependencias

- React
- React Router DOM
- Vite
- JavaScript
- CSS
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- localStorage

## Mejoras implementadas

- Migración de la persistencia desde JSON hacia MongoDB.
- Creación de esquemas de usuarios, productos y órdenes.
- Operaciones CRUD completas sobre productos.
- Operaciones de lectura, creación, actualización y eliminación de órdenes.
- Filtros de productos por categoría.
- Relaciones entre colecciones mediante referencias.
- Uso de `populate` en órdenes.
- Registro de usuarios.
- Encriptación de contraseñas mediante bcrypt.
- Login con validación de contraseña.
- Generación de JWT.
- Middleware para verificar tokens.
- Protección de la creación de órdenes.
- Integración del token con el frontend.
- Actualización de stock luego de una compra.

## Pruebas

Las pruebas de rutas y operaciones CRUD pueden realizarse con Postman.

El detalle de las pruebas se encuentra en:

`PRUEBAS_POSTMAN.md`

## Video explicativo

**Link al video:** [Ver Demo.mp4 en Google Drive](https://drive.google.com/drive/folders/1-j4ajAQhdNo1PPqHY6GFhtIfXV7Pt7yU?usp=sharing)

El video debe mostrar la aplicación, las operaciones CRUD, autenticación, MongoDB, estructura del proyecto y pruebas mediante Postman.

## Publicación

Deploy opcional.
