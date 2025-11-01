# VivaColors (Back)

Este repositorio contiene el backend de VivaColors, una API creada con TypeScript, Express y Apollo Server (GraphQL), con persistencia en MongoDB.

## Resumen rápido

- Endpoint GraphQL: `http://localhost:3000/graphql`
- Empaquetado para desarrollo con Docker (el `docker-compose.yml` monta el código y ejecuta `npm run dev`).
- Tests con Jest (se encuentran en `src/tests`).

---

## Requisitos

- Docker y Docker Compose instalados
- Node.js (para ejecutar tests localmente si no usas Docker)
- Una instancia de MongoDB disponible (puede ser local o Atlas). Para los tests y para ejecutar la app, la app lee `MONGO_URI` desde el `.env`.

Variables de entorno principales (archivo `.env` en la raíz):

- `MONGO_URI` – URI de conexión a MongoDB (por ejemplo `mongodb://localhost:27017/vivacolors`)
- `PORT` – puerto en el que arranca la app (por defecto `3000`)
- `JWT_SECRET` – clave secreta para firmar tokens JWT

Ejemplo de `.env` mínimo:

PORT=3000
MONGO_URI=mongodb://localhost:27017/vivacolors
JWT_SECRET=un_secreto_muy_seguro

---

## Ejecutar con Docker Compose

El `docker-compose.yml` del proyecto define un servicio llamado `backend` que:
- construye la imagen usando el `Dockerfile`
- mapea el puerto `3000`
- carga variables desde `.env`
- monta el código del host en `/app` dentro del contenedor y ejecuta `npm run dev` (modo desarrollo)

Pasos para levantarlo:

1) Construir la imagen (sin usar cache):

```powershell
docker-compose build --no-cache
```

2) Levantar el servicio (en primer plano):

```powershell
docker-compose up
```

O levantar en segundo plano (detached):

```powershell
docker-compose up -d
```

Notas:
- El `Dockerfile` está optimizado para desarrollo (usa `npm run dev` y monta volumenes) por lo que los cambios en el código local se reflejan inmediatamente.
- Si quieres crear una imagen apta para producción deberías ajustar el `Dockerfile` para realizar `npm run build` y ejecutar `node dist/server.js`.

---

## Ejecutar tests

Los tests usan Jest y `supertest` para hacer requests HTTP contra el servidor GraphQL.

Instala dependencias localmente (si no usas Docker):

```powershell
npm install
```

Comandos útiles:

- Ejecutar todos los tests (paralelamente):

```powershell
npx jest
```

- Ejecutar todos los tests en banda (útil si hay problemas con DB o recursos compartidos):

```powershell
npx jest --runInBand
```

- Ejecutar un test específico (ejemplo `quote`):

```powershell
npx jest src/tests/quote.test.ts
```

Notas sobre tests:
- Los tests hacen uso real de la base de datos definida por `MONGO_URI`. Antes de ejecutar tests, asegúrate de apuntar `MONGO_URI` a una base de datos de testing (no la base de datos de producción).
- Los tests crean usuarios y productos de prueba y los eliminan en `afterAll`. Si los tests fallan por tiempo de conexión, verifica que MongoDB esté accesible desde donde ejecutas los tests.

---
## GraphQL Vogayer

Se aceccede con esta ruta: 
```
http://localhost:3000/graphql
```
Se usa para ver la estructura del backedn de manera visual y ver su relaciones


## GraphQL (qué hace y cómo usarlo)

La API GraphQL está expuesta en:

```
POST http://localhost:3000/graphql
```

Autenticación
- Muchas operaciones requieren autenticación JWT. Debes enviar el header HTTP:

```
Authorization: Bearer <token>
```

- Obtienes el token con la mutación `loginUser` (ver abajo).

Esquemas principales (resumen):

- User
  - Mutations: `registerUser`, `loginUser`, `logoutUser`
  - Query: `me`, `users` (lista, solo admin)

- Quote
  - Type `Quote` con items, total, status, rejectionReason, createdAt
  - Mutations:
    - `createQuote(input: CreateQuoteInput!)` – crea cotización (usuario autenticado)
    - `updateQuoteStatus(id, status, rejectionReason)` – actualiza estado (solo admin)
    - `deleteQuote(id)` – elimina cotización (solo admin)
  - Queries: `quotes` (lista: admin ve todo, usuario solo las suyas), `quote(id)`

Ejemplos rápidos

- Login (obtener token):

```graphql
mutation {
  loginUser(input: { email: "user@example.com", password: "123456" }) {
    token
    user { id name email role }
  }
}
```

- Crear una cotización (usar `Authorization: Bearer <token>` de un usuario):

```graphql
mutation {
  createQuote(input: { items: [{ product: "<productId>", quantity: 2, price: 500 }], total: 1000 }) {
    id
    total
    status
  }
}
```

- Actualizar estado a `aprobada` (solo admin):

```graphql
mutation {
  updateQuoteStatus(id: "<quoteId>", status: aprobada) {
    id
    status
  }
}
```

Cómo probar GraphQL
- Puedes usar herramientas como Insomnia, Postman, Altair o GraphiQL para enviar requests POST a `/graphql`.
- No se incluye una interfaz Playground embebida por defecto en la configuración actual; si quieres un IDE web, instala un cliente o habilita un plugin habilitando la interfaz en la configuración de Apollo (en v4 la "Sandbox" de Apollo es una alternativa).

---

## Estructura importante del proyecto

- `src/app.ts` – crea y configura el servidor (Express + Apollo Server) y monta `/graphql`.
- `src/server.ts` – arranca la aplicación.
- `src/interface/graphql/schema/` – schemas GraphQL (user, product, order, quote).
- `src/interface/graphql/resolvers/` – resolvers correspondientes.
- `src/infrastructure/db/mongo/models/` – modelos Mongoose (User, Product, Quote, etc.).
- `src/infrastructure/db/connection.ts` – helper para conectar a MongoDB.
- `src/tests/` – tests con `supertest` y Jest.

---

## Consejos y pasos de verificación rápidos

- Antes de correr la app o tests, crea un `.env` con `MONGO_URI` y `JWT_SECRET`.
- Para desarrollo rápido con Docker (recomendado si quieres aislar tu entorno):
  1. `docker-compose build --no-cache`
  2. `docker-compose up`
  3. Ir a `http://localhost:3000/graphql` y usar tu cliente GraphQL favorito.
- Para correr tests localmente (sin Docker):
  1. `npm install`
  2. Asegurarte que MongoDB esté accesible y `MONGO_URI` apunte a una DB de testing
  3. `npx jest --runInBand` si hay problemas de concurrencia

